import { Module } from '@nestjs/common';
import { VectorSearchController } from './controllers/vector-search.controller';
import { VectorSearchService } from './services/vector-search.service';
import { VectorSearchGateway } from './gateway/vector-search.gateway';
import { LocalVectorSearchProvider } from './providers/local-vector-search.provider';
import { VectorSearchRepository } from './repositories/vector-search.repository';
import { VectorSearchEventEmitter } from './events/vector-search-event.emitter';
import { PrismaModule } from '../database/prisma.module';
import { EmbeddingsModule } from '../embeddings/embeddings.module';

@Module({
  imports: [PrismaModule, EmbeddingsModule],
  controllers: [VectorSearchController],
  providers: [
    VectorSearchService,
    VectorSearchGateway,
    LocalVectorSearchProvider,
    VectorSearchRepository,
    VectorSearchEventEmitter,
  ],
  exports: [VectorSearchService, VectorSearchGateway],
})
export class VectorSearchModule {}
