export interface ParsedDocument {
  title: string;
  content: string;
  pageCount?: number;
  wordCount: number;
  characterCount: number;
  language?: string;
  metadata: Record<string, unknown>;
}

export interface IDocumentParser {
  supports(mimeType: string): boolean;
  parse(buffer: Buffer): Promise<ParsedDocument>;
  validate(buffer: Buffer): Promise<boolean>;
  metadata(): ParserMetadata;
}

export interface ParserMetadata {
  name: string;
  version: string;
  supportedTypes: string[];
  description: string;
}
