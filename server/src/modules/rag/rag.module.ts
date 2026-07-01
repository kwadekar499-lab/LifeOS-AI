import { Module } from '@nestjs/common';
import { RAGService } from './services/rag.service';
import { RagValidator } from './validators/rag.validator';
import { MergeStrategyService } from './merging/merge-strategy.service';
import { RAGEventEmitter } from './events/rag-event.emitter';
import { RAGController } from './controllers/rag.controller';

@Module({
  imports: [],
  controllers: [RAGController],
  providers: [RAGService, RagValidator, MergeStrategyService, RAGEventEmitter],
  exports: [RAGService],
})
export class RAGModule {}
