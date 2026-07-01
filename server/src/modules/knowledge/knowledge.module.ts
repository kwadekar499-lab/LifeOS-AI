import { Module } from '@nestjs/common';
import { KnowledgeController } from './controllers/knowledge.controller';
import { KnowledgeService } from './services/knowledge.service';
import { KnowledgeRepository } from './repositories/knowledge.repository';
import { KnowledgeEventEmitter } from './events/knowledge-event-emitter.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  controllers: [KnowledgeController],
  providers: [KnowledgeService, KnowledgeRepository, KnowledgeEventEmitter],
  imports: [PrismaModule],
  exports: [KnowledgeService, KnowledgeRepository],
})
export class KnowledgeModule {}
