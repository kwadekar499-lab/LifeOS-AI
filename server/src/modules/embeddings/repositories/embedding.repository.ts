import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class EmbeddingRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    chunkId: string;
    userId: string;
    fileId: string;
    documentId: string;
    embedding: number[];
    provider: string;
    model: string;
    dimensions: number;
    tokenCount: number | null;
    latencyMs: number | null;
    costEstimate: number;
  }) {
    return this.prisma.embedding.create({
      data: {
        chunkId: data.chunkId,
        userId: data.userId,
        fileId: data.fileId,
        documentId: data.documentId,
        embedding: data.embedding,
        provider: data.provider,
        model: data.model,
        dimensions: data.dimensions,
        tokenCount: data.tokenCount,
        latencyMs: data.latencyMs,
        costEstimate: data.costEstimate,
      },
    });
  }

  async createBatch(
    items: Array<{
      chunkId: string;
      userId: string;
      fileId: string;
      documentId: string;
      embedding: number[];
      provider: string;
      model: string;
      dimensions: number;
      tokenCount: number | null;
      latencyMs: number | null;
      costEstimate: number;
    }>
  ) {
    return this.prisma.embedding.createMany({ data: items });
  }

  async findByChunk(chunkId: string) {
    return this.prisma.embedding.findUnique({ where: { chunkId } });
  }

  async findByFile(fileId: string) {
    return this.prisma.embedding.findMany({ where: { fileId } });
  }

  async delete(id: string) {
    return this.prisma.embedding.delete({ where: { id } });
  }

  async deleteByFile(fileId: string) {
    return this.prisma.embedding.deleteMany({ where: { fileId } });
  }
}
