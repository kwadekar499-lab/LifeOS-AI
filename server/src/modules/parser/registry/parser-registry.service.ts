import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IDocumentParser, ParserMetadata } from '../interfaces/document-parser.interface';
import { TextParser } from '../parsers/text-parser.service';
import { MarkdownParser } from '../parsers/markdown-parser.service';
import { PdfParser } from '../parsers/pdf-parser.service';
import { DocxParser } from '../parsers/docx-parser.service';

@Injectable()
export class ParserRegistry implements OnModuleInit {
  private readonly logger = new Logger(ParserRegistry.name);
  private readonly parsers: IDocumentParser[] = [];
  private readonly parserMap: Map<string, IDocumentParser> = new Map();

  constructor(
    private readonly textParser: TextParser,
    private readonly markdownParser: MarkdownParser,
    private readonly pdfParser: PdfParser,
    private readonly docxParser: DocxParser
  ) {}

  onModuleInit(): void {
    this.registerParser(this.textParser);
    this.registerParser(this.markdownParser);
    this.registerParser(this.pdfParser);
    this.registerParser(this.docxParser);

    this.logger.log({
      parserCount: this.parsers.length,
      parsers: this.parsers.map((p) => p.metadata().name),
      action: 'registry.initialized',
    });
  }

  private registerParser(parser: IDocumentParser): void {
    const metadata = parser.metadata();

    for (const mimeType of metadata.supportedTypes) {
      this.parserMap.set(mimeType.toLowerCase(), parser);
    }

    this.parsers.push(parser);
    this.logger.log({
      parser: metadata.name,
      supportedTypes: metadata.supportedTypes,
      action: 'parser.registered',
    });
  }

  getParser(mimeType: string): IDocumentParser | null {
    const normalized = mimeType.toLowerCase();

    for (const [key, parser] of this.parserMap.entries()) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return parser;
      }
    }

    return null;
  }

  getSupportedParsers(): ParserMetadata[] {
    return this.parsers.map((parser) => parser.metadata());
  }

  getAllParsers(): IDocumentParser[] {
    return [...this.parsers];
  }

  isSupported(mimeType: string): boolean {
    return this.getParser(mimeType) !== null;
  }
}
