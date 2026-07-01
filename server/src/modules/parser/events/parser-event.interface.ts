export interface ParserEventPayload {
  fileId: string;
  userId: string;
  requestId?: string;
  timestamp: Date;
}

export interface DocumentParseStartedPayload extends ParserEventPayload {
  fileName: string;
  mimeType: string;
  size: number;
}

export interface DocumentParseCompletedPayload extends ParserEventPayload {
  documentId: string;
  title: string;
  wordCount: number;
  characterCount: number;
  pageCount?: number;
  chunkCount: number;
  parseDuration: number;
}

export interface DocumentChunkCreatedPayload extends ParserEventPayload {
  documentId: string;
  chunkIndex: number;
  characterCount: number;
  estimatedTokens: number;
}

export interface DocumentDeletedPayload extends ParserEventPayload {
  documentId: string;
  title: string;
}

export interface DocumentFailedPayload extends ParserEventPayload {
  fileName: string;
  mimeType: string;
  error: string;
  parseDuration: number;
}

export interface ParserEventMap {
  'document.parse.started': DocumentParseStartedPayload;
  'document.parse.completed': DocumentParseCompletedPayload;
  'document.chunk.created': DocumentChunkCreatedPayload;
  'document.deleted': DocumentDeletedPayload;
  'document.failed': DocumentFailedPayload;
}
