import { Module } from '@nestjs/common';
import { EmbeddingController } from './controllers/embedding.controller';
import { EmbeddingService } from './services/embedding.service';
import { PrismaModule } from '../database/prisma.module';
import { EmbeddingGateway } from './gateway/embedding.gateway';
import { GeminiEmbeddingProvider } from './providers/gemini-embedding.provider';
import { EmbeddingRepository } from './repositories/embedding.repository';
import { EmbeddingEventEmitter } from './events/embedding-event.emitter';

@Module({
  imports: [PrismaModule],
  controllers: [EmbeddingController],
  providers: [EmbeddingService, EmbeddingGateway, GeminiEmbeddingProvider, EmbeddingRepository, EmbeddingEventEmitter],
  exports: [EmbeddingService, EmbeddingGateway],
})
export class EmbeddingsModule {}
