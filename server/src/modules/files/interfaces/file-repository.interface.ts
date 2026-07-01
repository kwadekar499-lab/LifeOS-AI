export type { PaginatedFileResult, FileListOptions, FileSearchFilters };
import { PaginatedFileResult, FileListOptions, FileSearchFilters } from '../types/file-upload.type';
import { File as PrismaFile } from '@prisma/client';

export interface IFileRepository {
  create(
    userId: string,
    data: {
      originalName: string;
      storedName: string;
      mimeType: string;
      extension: string;
      size: number;
      checksum: string;
      storagePath: string;
      status?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<PrismaFile>;

  findById(id: string, userId: string): Promise<PrismaFile | null>;
  list(userId: string, options?: FileListOptions): Promise<PaginatedFileResult>;
  search(userId: string, query: string, filters?: FileSearchFilters): Promise<PaginatedFileResult>;
  softDelete(id: string, userId: string): Promise<PrismaFile>;
  restore(id: string, userId: string): Promise<PrismaFile>;
  findByChecksum(checksum: string): Promise<PrismaFile | null>;
}
