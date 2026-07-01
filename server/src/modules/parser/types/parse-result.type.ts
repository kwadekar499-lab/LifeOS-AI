import { ParsedDocument } from '../interfaces/document-parser.interface';

export interface ParseResult {
  success: boolean;
  document?: ParsedDocument;
  error?: string;
  parseDuration: number;
}

export interface ChunkResult {
  success: boolean;
  chunks?: Array<{
    content: string;
    chunkIndex: number;
    startOffset: number;
    endOffset: number;
    estimatedTokens: number;
    characterCount: number;
    checksum: string;
  }>;
  error?: string;
  chunkCount: number;
}

export interface DocumentParseRequest {
  fileId: string;
  userId: string;
}

export interface DocumentParseResponse {
  documentId: string;
  fileId: string;
  title: string;
  wordCount: number;
  characterCount: number;
  pageCount?: number;
  language?: string;
  chunkCount: number;
  parseDuration: number;
  parsingStatus: string;
}

export interface DocumentListOptions {
  limit?: number;
  cursor?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface DocumentSearchFilters {
  parsingStatus?: string;
  language?: string;
  minWordCount?: number;
  maxWordCount?: number;
}
