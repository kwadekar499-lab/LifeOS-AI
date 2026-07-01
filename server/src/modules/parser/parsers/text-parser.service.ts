import { Injectable, Logger } from '@nestjs/common';
import { IDocumentParser, ParsedDocument, ParserMetadata } from '../interfaces/document-parser.interface';
import { PARSER_CONSTANTS } from '../constants/parser.constants';

@Injectable()
export class TextParser implements IDocumentParser {
  private readonly logger = new Logger(TextParser.name);
  private readonly parserMetadata: ParserMetadata = {
    name: 'text-parser',
    version: '1.0.0',
    supportedTypes: [PARSER_CONSTANTS.SUPPORTED_MIME_TYPES.TEXT, ...PARSER_CONSTANTS.SUPPORTED_EXTENSIONS.TEXT],
    description: 'Plain text file parser',
  };

  constructor() {}

  supports(mimeType: string): boolean {
    return (
      mimeType === PARSER_CONSTANTS.SUPPORTED_MIME_TYPES.TEXT ||
      this.parserMetadata.supportedTypes.some((type) => mimeType.includes(type))
    );
  }

  async parse(buffer: Buffer): Promise<ParsedDocument> {
    const startTime = Date.now();
    this.logger.log({ size: buffer.length, action: 'parse.started' });

    try {
      const content = buffer.toString('utf-8');
      const lines = content.split(/\r?\n/);
      const firstNonEmptyLine = lines.find((line) => line.trim().length > 0);

      const title = firstNonEmptyLine?.trim().substring(0, 100) || 'Untitled Document';
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
        title,
        content: content.trim(),
        pageCount: undefined,
        wordCount,
        characterCount,
        language,
        metadata: {
          parser: this.parserMetadata.name,
          lineCount: lines.length,
          encoding: 'utf-8',
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error({ error, action: 'parse.failed' });
      throw new Error(`Failed to parse text file: ${errorMessage}`);
    }
  }

  async validate(buffer: Buffer): Promise<boolean> {
    if (!buffer || buffer.length === 0) {
      return false;
    }

    try {
      buffer.toString('utf-8');
      return true;
    } catch {
      return false;
    }
  }

  metadata(): ParserMetadata {
    return this.parserMetadata;
  }

  private countWords(content: string): number {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    return words.length;
  }

  private detectLanguage(content: string): string {
    if (!PARSER_CONSTANTS.LANGUAGE_DETECTION.ENABLED) {
      return PARSER_CONSTANTS.LANGUAGE_DETECTION.DEFAULT;
    }

    const sample = content.substring(0, 1000);

    const englishWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'for', 'with', 'as'];
    const englishCount = englishWords.filter((word) => sample.toLowerCase().includes(word)).length;

    if (englishCount > englishWords.length / 2) {
      return 'en';
    }

    return 'unknown';
  }
}
