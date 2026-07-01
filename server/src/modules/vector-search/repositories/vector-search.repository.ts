import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class VectorSearchRepository {
  private readonly logger = new Logger(VectorSearchRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findEmbeddingsForSearch(_filters: {
    userId: string;
    fileIds?: string[];
    documentIds?: string[];
  }): Promise<any[]> {
    return [];
  }

  async recordQuery(query: string, userId: string): Promise<void> {
    this.logger.log({ query, userId, action: 'query.recorded' });
  }

  async recordEmbedding(_query: string, userId: string): Promise<void> {
    this.logger.log({ query: _query, userId, action: 'embedding.recorded' });
  }

  async getHistory(_userId: string): Promise<any[]> {
    return [];
  }
}
