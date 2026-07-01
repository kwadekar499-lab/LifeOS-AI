import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DocumentEntity, DocumentChunkEntity } from '../entities/document.entity';
import {
  CreateDocumentInput,
  DocumentListOptions,
  DocumentSearchFilters,
} from '../interfaces/document-repository.interface';

@Injectable()
export class DocumentRepository {
  private readonly logger = new Logger(DocumentRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(_userId: string, data: CreateDocumentInput): Promise<DocumentEntity> {
    const document = await this.prisma.document.create({
      data: {
        ...data,
        userId: _userId,
      },
    });

    this.logger.log({ userId: _userId, documentId: document.id, action: 'document.created' });
    return document as DocumentEntity;
  }

  async findById(id: string, _userId: string): Promise<DocumentEntity | null> {
    return this.prisma.document.findFirst({
      where: { id, userId: _userId, deletedAt: null },
    }) as Promise<DocumentEntity | null>;
  }

  async findByFileId(fileId: string, _userId: string): Promise<DocumentEntity | null> {
    return this.prisma.document.findFirst({
      where: { fileId, userId: _userId, deletedAt: null },
    }) as Promise<DocumentEntity | null>;
  }

  async createChunk(documentId: string, fileId: string, _userId: string, data: any): Promise<DocumentChunkEntity> {
    const chunk = await this.prisma.documentChunk.create({
      data: {
        documentId,
        fileId,
        userId: _userId,
        ...data,
      },
    });

    this.logger.log({ documentId, chunkId: chunk.id, action: 'chunk.created' });
    return chunk as DocumentChunkEntity;
  }

  async findChunksByDocumentId(documentId: string, _userId: string): Promise<DocumentChunkEntity[]> {
    return this.prisma.documentChunk.findMany({
      where: { documentId, userId: _userId },
      orderBy: { chunkIndex: 'asc' },
    }) as Promise<DocumentChunkEntity[]>;
  }

  async deleteChunksByDocumentId(documentId: string, _userId: string): Promise<void> {
    await this.prisma.documentChunk.deleteMany({
      where: { documentId, userId: _userId },
    });
  }

  async updateStatus(id: string, _userId: string, status: string): Promise<DocumentEntity> {
    return this.prisma.document.update({
      where: { id },
      data: { parsingStatus: status },
    }) as Promise<DocumentEntity>;
  }

  async softDelete(id: string, _userId: string): Promise<void> {
    await this.prisma.document.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async list(_userId: string, options?: DocumentListOptions): Promise<DocumentEntity[]> {
    const where: any = { userId: _userId, deletedAt: null };

    if (options?.status) {
      where.parsingStatus = options.status;
    }

    return this.prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 50,
    }) as Promise<DocumentEntity[]>;
  }

  async search(_userId: string, query: string, filters?: DocumentSearchFilters): Promise<DocumentEntity[]> {
    const where: any = {
      userId: _userId,
      deletedAt: null,
      AND: [
        query ? { title: { contains: query, mode: 'insensitive' } } : {},
        filters?.mimeType ? { mimeType: filters.mimeType } : {},
        filters?.status ? { parsingStatus: filters.status } : {},
        filters?.extension ? { extension: filters.extension } : {},
      ],
    };

    return this.prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 20,
    }) as Promise<DocumentEntity[]>;
  }
}
