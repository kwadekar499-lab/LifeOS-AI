import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ParserRegistry } from '../registry/parser-registry.service';
import { SemanticChunkerService } from '../chunking/semantic-chunker.service';
import { DocumentRepository } from '../repositories/document.repository';
import { ParserMetadata } from '../interfaces/document-parser.interface';
import { ParseResult, DocumentListOptions } from '../types/parse-result.type';
import { ParserEventEmitterService } from '../events/parser-event-emitter.service';
import { FileService } from '../../files/services/file.service';

@Injectable()
export class ParserService implements OnModuleInit {
  private readonly logger = new Logger(ParserService.name);

  constructor(
    private readonly parserRegistry: ParserRegistry,
    private readonly semanticChunker: SemanticChunkerService,
    private readonly documentRepository: DocumentRepository,
    private readonly eventEmitter: ParserEventEmitterService,
    private readonly fileService: FileService
  ) {}

  onModuleInit(): void {
    this.logger.log({ action: 'service.initialized' });
  }

  async parseDocument(fileId: string, userId: string, requestId?: string): Promise<ParseResult> {
    const startTime = Date.now();
    this.logger.log({ fileId, userId, action: 'parse.started' });

    try {
      const file = await this.fileService.findById(fileId, userId);

      if (!file) {
        throw new Error('File not found');
      }

      const mimeType = file.mimeType;
      const parser = this.parserRegistry.getParser(mimeType);

      if (!parser) {
        throw new Error(`Unsupported MIME type: ${mimeType}`);
      }

      const buffer = await this.fileService.readFile(file.id, userId);
      const validationResult = await parser.validate(buffer);

      if (!validationResult) {
        throw new Error('File validation failed - corrupted or invalid format');
      }

      await this.documentRepository.create(userId, {
        fileId,
        title: 'Processing...',
        content: '',
        wordCount: 0,
        characterCount: 0,
        parsingStatus: 'processing',
      });

      this.eventEmitter.emitDocumentParseStarted({
        timestamp: new Date(),
        fileId,
        userId,
        requestId,
        fileName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
      });

      const parsedDocument = await parser.parse(buffer);
      const document = await this.documentRepository.findByFileId(fileId, userId);

      if (!document) {
        throw new Error('Document not found after parsing');
      }

      await this.documentRepository.updateStatus(document.id, userId, 'processing');

      const chunks = this.semanticChunker.chunk(parsedDocument.content);

      for (const chunk of chunks) {
        await this.documentRepository.createChunk(document.id, fileId, userId, {
          chunkIndex: chunk.chunkIndex,
          content: chunk.content,
          startOffset: chunk.startOffset,
          endOffset: chunk.endOffset,
          estimatedTokens: chunk.estimatedTokens,
          characterCount: chunk.characterCount,
          checksum: chunk.checksum,
        });

        this.eventEmitter.emitDocumentChunkCreated({
          timestamp: new Date(),
          fileId,
          userId,
          requestId,
          documentId: document.id,
          chunkIndex: chunk.chunkIndex,
          characterCount: chunk.characterCount,
          estimatedTokens: chunk.estimatedTokens,
        });
      }

      await this.documentRepository.create(userId, {
        fileId,
        title: parsedDocument.title,
        content: parsedDocument.content,
        wordCount: parsedDocument.wordCount,
        characterCount: parsedDocument.characterCount,
        pageCount: parsedDocument.pageCount,
        language: parsedDocument.language,
        parsingStatus: 'completed',
        metadata: parsedDocument.metadata,
      });

      if (document) {
        await this.documentRepository.updateStatus(document.id, userId, 'completed');
      }

      const parseDuration = Date.now() - startTime;

      this.eventEmitter.emitDocumentParseCompleted({
        timestamp: new Date(),
        fileId,
        userId,
        requestId,
        documentId: document.id,
        title: parsedDocument.title,
        wordCount: parsedDocument.wordCount,
        characterCount: parsedDocument.characterCount,
        pageCount: parsedDocument.pageCount,
        chunkCount: chunks.length,
        parseDuration,
      });

      this.logger.log({
        fileId,
        documentId: document.id,
        wordCount: parsedDocument.wordCount,
        chunkCount: chunks.length,
        parseDuration,
        action: 'parse.completed',
      });

      return {
        success: true,
        document: parsedDocument,
        parseDuration,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const parseDuration = Date.now() - startTime;

      this.logger.error({
        fileId,
        userId,
        error: errorMessage,
        parseDuration,
        action: 'parse.failed',
      });

      this.eventEmitter.emitDocumentFailed({
        timestamp: new Date(),
        fileId,
        userId,
        requestId,
        fileName: 'unknown',
        mimeType: 'unknown',
        error: errorMessage,
        parseDuration,
      });

      return {
        success: false,
        error: errorMessage,
        parseDuration,
      };
    }
  }

  async getDocument(fileId: string, userId: string): Promise<any> {
    this.logger.log({ fileId, userId, action: 'document.get' });

    const document = await this.documentRepository.findByFileId(fileId, userId);

    if (!document) {
      return null;
    }

    return document;
  }

  async getChunks(fileId: string, userId: string): Promise<any> {
    this.logger.log({ fileId, userId, action: 'chunks.get' });

    const document = await this.documentRepository.findByFileId(fileId, userId);

    if (!document) {
      return null;
    }

    return document.chunks || [];
  }

  async deleteDocument(fileId: string, userId: string): Promise<boolean> {
    this.logger.log({ fileId, userId, action: 'document.delete' });

    const document = await this.documentRepository.findByFileId(fileId, userId);

    if (!document) {
      return false;
    }

    await this.documentRepository.deleteChunksByDocumentId(document.id, userId);
    await this.documentRepository.softDelete(document.id, userId);

    this.eventEmitter.emitDocumentDeleted({
      timestamp: new Date(),
      fileId,
      userId,
      documentId: document.id,
      title: document.title,
    });

    return true;
  }

  async listDocuments(userId: string, options?: DocumentListOptions): Promise<any> {
    this.logger.log({ userId, options, action: 'documents.list' });
    return this.documentRepository.list(userId, options);
  }

  getSupportedParsers(): ParserMetadata[] {
    return this.parserRegistry.getSupportedParsers();
  }

  isSupported(mimeType: string): boolean {
    return this.parserRegistry.isSupported(mimeType);
  }
}
