export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  errorCode?: string;
}

export interface UploadedFileData {
  originalName: string;
  mimeType: string;
  extension: string;
  size: number;
  buffer: Buffer;
}

export interface FileMetadata {
  width?: number;
  height?: number;
  pageCount?: number;
  author?: string;
  createdAt?: Date;
}

export interface FileChecksum {
  md5: string;
  sha256: string;
}

export interface FileSearchFilters {
  mimeType?: string;
  extension?: string;
  minSize?: number;
  maxSize?: number;
  startDate?: Date;
  endDate?: Date;
  status?: string;
}

export interface FileListOptions {
  cursor?: string;
  limit?: number;
  sortBy?: 'createdAt' | 'size' | 'originalName';
  sortOrder?: 'asc' | 'desc';
  filters?: FileSearchFilters;
}

export interface PaginatedFileResult {
  data: import('@prisma/client').File[];
  meta: {
    total: number;
    cursor: string | null;
    hasMore: boolean;
  };
}

export interface FileStorageResult {
  storedName: string;
  storagePath: string;
  size: number;
}
