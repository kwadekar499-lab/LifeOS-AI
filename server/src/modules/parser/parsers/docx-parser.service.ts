import { Injectable, Logger } from '@nestjs/common';
import { IDocumentParser, ParsedDocument, ParserMetadata } from '../interfaces/document-parser.interface';
import { PARSER_CONSTANTS } from '../constants/parser.constants';
import * as mammoth from 'mammoth';

@Injectable()
export class DocxParser implements IDocumentParser {
  private readonly logger = new Logger(DocxParser.name);
  private readonly parserMetadata: ParserMetadata = {
    name: 'docx-parser',
    version: '1.0.0',
    supportedTypes: [PARSER_CONSTANTS.SUPPORTED_MIME_TYPES.DOCX, ...PARSER_CONSTANTS.SUPPORTED_EXTENSIONS.DOCX],
    description: 'DOCX document parser',
  };

  constructor() {}

  supports(mimeType: string): boolean {
    return mimeType === PARSER_CONSTANTS.SUPPORTED_MIME_TYPES.DOCX || mimeType.toLowerCase().includes('word');
  }

  async parse(buffer: Buffer): Promise<ParsedDocument> {
    const startTime = Date.now();
    this.logger.log({ size: buffer.length, action: 'parse.started' });

    try {
      const result = await mammoth.extractRawText({ buffer });
      const content = this.cleanText(result.value);
      const wordCount = this.countWords(content);
      const characterCount = content.length;
      const language = this.detectLanguage(content);

      this.logger.log({
        wordCount,
        characterCount,
        parseDuration: Date.now() - startTime,
        action: 'parse.completed',
      });

      return {
        title: 'DOCX Document',
        content,
        wordCount,
        characterCount,
        language,
        metadata: {
          parser: this.parserMetadata.name,
          warnings: result.messages,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error({ error, action: 'parse.failed' });
      throw new Error(`Failed to parse DOCX file: ${errorMessage}`);
    }
  }

  async validate(buffer: Buffer): Promise<boolean> {
    if (!buffer || buffer.length === 0) {
      return false;
    }

    try {
      const header = buffer.toString('hex', 0, 8);
      return header.toLowerCase() === '504b0304';
    } catch {
      return false;
    }
  }

  metadata(): ParserMetadata {
    return this.parserMetadata;
  }

  private cleanText(text: string): string {
    return text
      .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private countWords(content: string): number {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    return words.length;
  }

  private detectLanguage(content: string): string {
    const sample = content.substring(0, 1000);
    const englishWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'for', 'with', 'as'];
    const englishCount = englishWords.filter((word) => sample.toLowerCase().includes(word)).length;

    if (englishCount > englishWords.length / 2) {
      return 'en';
    }

    return 'unknown';
  }
}
