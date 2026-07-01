import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EmbeddingService } from '../services/embedding.service';
import { PrismaService } from '../../database/prisma.service';
import { GenerateEmbeddingDto } from '../dto/generate-embedding.dto';
import { EMBEDDINGS_ROUTE } from '../constants/embedding.constants';

@ApiTags('embeddings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(EMBEDDINGS_ROUTE)
export class EmbeddingController {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly prisma: PrismaService
  ) {}

  @Post('generate/:fileId')
  @ApiOperation({ summary: 'Generate embeddings for all chunks in a file' })
  async generateForFile(@Param('fileId') fileId: string, @Body() _dto: GenerateEmbeddingDto, @Req() req: any) {
    const userId = req.user.id;
    const chunks = await this.prisma.documentChunk.findMany({ where: { fileId, userId } });
    const chunkData = chunks.map((c) => ({ id: c.id, content: c.content, documentId: c.documentId }));
    return this.embeddingService.generateForFile(chunkData, userId, fileId);
  }

  @Post('chunk/:chunkId')
  @ApiOperation({ summary: 'Generate embedding for a single chunk' })
  async generateForChunk(@Param('chunkId') chunkId: string, @Req() req: any) {
    const userId = req.user.id;
    const chunk = await this.prisma.documentChunk.findUnique({ where: { id: chunkId } });
    if (!chunk || chunk.userId !== userId) {
      return { error: 'Chunk not found or access denied' };
    }
    return this.embeddingService.generateForChunk(chunkId, chunk.content, userId, chunk.fileId, chunk.documentId);
  }

  @Get(':fileId')
  @ApiOperation({ summary: 'Get embeddings metadata for a file' })
  async getByFile(@Param('fileId') fileId: string, @Req() req: any) {
    const userId = req.user.id;
    const embeddings = await this.embeddingService.findByFile(fileId);
    return embeddings
      .filter((e) => e.userId === userId)
      .map((e) => ({
        id: e.id,
        chunkId: e.chunkId,
        provider: e.provider,
        model: e.model,
        dimensions: e.dimensions,
        tokenCount: e.tokenCount,
        latencyMs: e.latencyMs,
        costEstimate: e.costEstimate,
        createdAt: e.createdAt,
      }));
  }

  @Get('providers')
  @ApiOperation({ summary: 'List available embedding providers' })
  async getProviders() {
    return this.embeddingService.getProviders();
  }
}
