import { Injectable, Logger } from '@nestjs/common';
import { IDocumentParser, ParsedDocument, ParserMetadata } from '../interfaces/document-parser.interface';
import { PARSER_CONSTANTS } from '../constants/parser.constants';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class PdfParser implements IDocumentParser {
  private readonly logger = new Logger(PdfParser.name);
  private readonly parserMetadata: ParserMetadata = {
    name: 'pdf-parser',
    version: '1.0.0',
    supportedTypes: [PARSER_CONSTANTS.SUPPORTED_MIME_TYPES.PDF, ...PARSER_CONSTANTS.SUPPORTED_EXTENSIONS.PDF],
    description: 'PDF document parser',
  };

  constructor() {}

  supports(mimeType: string): boolean {
    return mimeType === PARSER_CONSTANTS.SUPPORTED_MIME_TYPES.PDF || mimeType.toLowerCase().includes('pdf');
  }

  async parse(buffer: Buffer): Promise<ParsedDocument> {
    const startTime = Date.now();
    this.logger.log({ size: buffer.length, action: 'parse.started' });

    try {
      const data = await pdfParse(buffer);

      const title = data.info?.Title || 'PDF Document';
      const content = this.cleanText(data.text);
      const wordCount = this.countWords(content);
      const characterCount = content.length;
      const pageCount = data.numpages || undefined;
      const language = this.detectLanguage(content);

      this.logger.log({
        wordCount,
        characterCount,
        pageCount,
        parseDuration: Date.now() - startTime,
        action: 'parse.completed',
      });

      return {
        title,
        content,
        pageCount,
        wordCount,
        characterCount,
        language,
        metadata: {
          parser: this.parserMetadata.name,
          version: data.version,
          info: data.info || {},
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error({ error, action: 'parse.failed' });
      throw new Error(`Failed to parse PDF file: ${errorMessage}`);
    }
  }

  async validate(buffer: Buffer): Promise<boolean> {
    if (!buffer || buffer.length === 0) {
      return false;
    }

    try {
      const header = buffer.toString('ascii', 0, 5);
      return header === '%PDF-';
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
