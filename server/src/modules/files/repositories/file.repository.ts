import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  IFileRepository,
  PaginatedFileResult,
  FileListOptions,
  FileSearchFilters,
} from '../interfaces/file-repository.interface';

@Injectable()
export class FileRepository implements IFileRepository {
  private readonly logger = new Logger(FileRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
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
  ): Promise<any> {
    const file = await this.prisma.file.create({
      data: {
        userId,
        originalName: data.originalName,
        storedName: data.storedName,
        mimeType: data.mimeType,
        extension: data.extension,
        size: data.size,
        checksum: data.checksum,
        storagePath: data.storagePath,
        status: data.status || 'ready',
        metadata: (data.metadata || {}) as any,
      },
    });

    this.logger.log({ userId, fileId: file.id, action: 'file.created' });
    return file;
  }

  async findById(id: string, userId: string): Promise<any> {
    return this.prisma.file.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });
  }

  async list(_userId: string, options?: FileListOptions): Promise<PaginatedFileResult> {
    const limit = options?.limit || 20;
    const cursor = options?.cursor;
    const sortBy = options?.sortBy || 'createdAt';
    const sortOrder = options?.sortOrder || 'desc';

    const where: any = {
      userId: _userId,
      deletedAt: null,
    };

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const result = await this.prisma.file.findMany({
      where,
      orderBy,
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });

    const hasMore = result.length > limit;
    const data = hasMore ? result.slice(0, limit) : result;
    const lastCursor = data.length > 0 ? data[data.length - 1].id : null;

    const total = await this.prisma.file.count({ where });

    return {
      data,
      meta: {
        total,
        cursor: hasMore ? lastCursor : null,
        hasMore,
      },
    };
  }

  async search(_userId: string, query: string, filters?: FileSearchFilters): Promise<PaginatedFileResult> {
    const limit = 20;
    const where: any = {
      userId: _userId,
      deletedAt: null,
      AND: [
        query
          ? {
              OR: [
                { originalName: { contains: query, mode: 'insensitive' } },
                { mimeType: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {},
        filters?.mimeType ? { mimeType: filters.mimeType } : {},
        filters?.extension ? { extension: filters.extension } : {},
        filters?.status ? { status: filters.status } : {},
        filters?.minSize ? { size: { gte: filters.minSize } } : {},
        filters?.maxSize ? { size: { lte: filters.maxSize } } : {},
      ],
    };

    const result = await this.prisma.file.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
    });

    const hasMore = result.length > limit;
    const data = hasMore ? result.slice(0, limit) : result;
    const lastCursor = data.length > 0 ? data[data.length - 1].id : null;

    return {
      data,
      meta: {
        total: data.length,
        cursor: hasMore ? lastCursor : null,
        hasMore,
      },
    };
  }

  async softDelete(id: string, _userId: string): Promise<any> {
    return this.prisma.file.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string, _userId: string): Promise<any> {
    return this.prisma.file.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async findByChecksum(checksum: string): Promise<any> {
    return this.prisma.file.findFirst({
      where: {
        checksum,
        deletedAt: null,
      },
    });
  }
}
