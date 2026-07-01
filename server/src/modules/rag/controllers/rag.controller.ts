import { Controller, Post, Get, Body, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RagQueryDto } from '../dto/rag-query.dto';
import { RAGService } from '../services/rag.service';

@ApiTags('RAG')
@ApiBearerAuth()
@Controller('rag')
@UseGuards(JwtAuthGuard)
export class RAGController {
  private readonly logger = new Logger(RAGController.name);

  constructor(private readonly ragService: RAGService) {}

  @Post('query')
  @ApiOperation({ summary: 'Execute RAG query' })
  async query(@CurrentUser('id') userId: string, @Body() dto: RagQueryDto) {
    this.logger.log({ msg: 'RAG query received', query: dto.query, userId });
    return this.ragService.query(dto, userId);
  }

  @Get('health')
  @ApiOperation({ summary: 'RAG module health check' })
  health() {
    return { status: 'ok', module: 'rag', timestamp: new Date().toISOString() };
  }

  @Get('metrics')
  @ApiOperation({ summary: 'RAG module metrics' })
  metrics() {
    return { module: 'rag', uptime: process.uptime() };
  }
}
