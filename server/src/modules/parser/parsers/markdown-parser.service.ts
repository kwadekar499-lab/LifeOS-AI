import { Injectable, Logger } from '@nestjs/common';
import { IDocumentParser, ParsedDocument, ParserMetadata } from '../interfaces/document-parser.interface';
import { PARSER_CONSTANTS } from '../constants/parser.constants';

@Injectable()
export class MarkdownParser implements IDocumentParser {
  private readonly logger = new Logger(MarkdownParser.name);
  private readonly parserMetadata: ParserMetadata = {
    name: 'markdown-parser',
    version: '1.0.0',
    supportedTypes: [PARSER_CONSTANTS.SUPPORTED_MIME_TYPES.MARKDOWN, ...PARSER_CONSTANTS.SUPPORTED_EXTENSIONS.MARKDOWN],
    description: 'Markdown file parser',
  };

  constructor() {}

  supports(mimeType: string): boolean {
    return (
      mimeType === PARSER_CONSTANTS.SUPPORTED_MIME_TYPES.MARKDOWN ||
      this.parserMetadata.supportedTypes.some((type) => mimeType.toLowerCase().includes(type.replace('.', '')))
    );
  }

  async parse(buffer: Buffer): Promise<ParsedDocument> {
    const startTime = Date.now();
    this.logger.log({ size: buffer.length, action: 'parse.started' });

    try {
      const content = buffer.toString('utf-8');
      const title = this.extractTitle(content);
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
          hasFrontmatter: content.startsWith('---'),
          headingCount: (content.match(/^#+\s/gm) || []).length,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error({ error, action: 'parse.failed' });
      throw new Error(`Failed to parse markdown file: ${errorMessage}`);
    }
  }

  async validate(buffer: Buffer): Promise<boolean> {
    if (!buffer || buffer.length === 0) {
      return false;
    }

    try {
      const content = buffer.toString('utf-8');
      return content.length > 0;
    } catch {
      return false;
    }
  }

  metadata(): ParserMetadata {
    return this.parserMetadata;
  }

  private extractTitle(content: string): string {
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('# ')) {
        return trimmed.substring(2).trim();
      }

      if (trimmed.startsWith('---')) {
        const yamlEndIndex = content.indexOf('---', 3);
        if (yamlEndIndex !== -1) {
          const yamlBlock = content.substring(3, yamlEndIndex);
          const titleMatch = yamlBlock.match(/^title:\s*(.+)$/m);
          if (titleMatch) {
            return titleMatch[1].trim();
          }
        }
      }

      if (trimmed.length > 0) {
        return trimmed.substring(0, 100);
      }
    }

    return 'Untitled Document';
  }

  private countWords(content: string): number {
    const textWithoutMarkdown = content
      .replace(/^#+\s/gm, '')
      .replace(/\*\*|__/g, '')
      .replace(/\*|_/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`{1,3}[^`]*`{1,3}/g, '');

    const words = textWithoutMarkdown
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
