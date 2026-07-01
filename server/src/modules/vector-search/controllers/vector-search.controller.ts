import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { VectorSearchService } from '../services/vector-search.service';
import { SearchVectorDto, BatchSearchVectorDto } from '../dto/search-vector.dto';
import { VECTOR_SEARCH_ROUTE } from '../constants/vector-search.constants';

@ApiTags('vector-search')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(VECTOR_SEARCH_ROUTE)
export class VectorSearchController {
  constructor(private readonly searchService: VectorSearchService) {}

  @Post('search')
  @ApiOperation({ summary: 'Semantic vector search' })
  async search(@Req() req: any, @Body() dto: SearchVectorDto) {
    const userId = req.user.id;
    const results = await this.searchService.search(dto.query, userId, {
      topK: dto.topK,
      threshold: dto.threshold,
      filters: {
        userId,
        fileIds: dto.fileIds,
        knowledgeIds: dto.knowledgeIds,
        documentIds: dto.documentIds,
        provider: dto.provider,
      },
    });
    return {
      queryId: '',
      query: dto.query,
      provider: 'local',
      topK: dto.topK || 10,
      latency: 0,
      results: results.map((r: any) => ({
        chunkId: r.chunkId,
        chunkContent: r.content,
        score: r.score,
        fileId: r.fileId,
        chunkIndex: r.chunkIndex,
        provider: r.provider,
        similarity: r.score,
        metadata: r.metadata,
      })),
    };
  }

  @Post('search/batch')
  @ApiOperation({ summary: 'Batch semantic vector search' })
  async searchBatch(@Req() req: any, @Body() dto: BatchSearchVectorDto) {
    const userId = req.user.id;
    const queries = dto.queries.map((q) => ({ query: q.query, userId }));
    const results = await this.searchService.searchBatch(queries, {
      topK: dto.queries[0]?.topK,
      threshold: dto.queries[0]?.threshold,
    });
    return results.map((batch: any[], i: number) => ({
      queryId: '',
      query: dto.queries[i]?.query || '',
      provider: 'local',
      topK: dto.queries[i]?.topK || 10,
      latency: 0,
      results: batch.map((r: any) => ({
        chunkId: r.chunkId,
        chunkContent: r.content,
        score: r.score,
        fileId: r.fileId,
        chunkIndex: r.chunkIndex,
        provider: r.provider,
        similarity: r.score,
        metadata: r.metadata,
      })),
    }));
  }

  @Get('providers')
  @ApiOperation({ summary: 'List vector search providers' })
  async getProviders() {
    return this.searchService.getProviders();
  }

  @Get('health')
  @ApiOperation({ summary: 'Vector search health check' })
  async health() {
    const healthy = await this.searchService.health();
    return { healthy, provider: 'local' };
  }
}
