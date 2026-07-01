import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class KnowledgeEventEmitter {
  private readonly logger = new Logger(KnowledgeEventEmitter.name);

  emitCreated(knowledgeId: string, userId: string, _metadata?: Record<string, unknown>): void {
    this.logger.log({ userId, knowledgeId, action: 'knowledge.created' });
  }

  emitUpdated(knowledgeId: string, userId: string, _metadata?: Record<string, unknown>): void {
    this.logger.log({ userId, knowledgeId, action: 'knowledge.updated' });
  }

  emitDeleted(knowledgeId: string, userId: string, _metadata?: Record<string, unknown>): void {
    this.logger.log({ userId, knowledgeId, action: 'knowledge.deleted' });
  }

  emitRestored(knowledgeId: string, userId: string, _metadata?: Record<string, unknown>): void {
    this.logger.log({ userId, knowledgeId, action: 'knowledge.restored' });
  }
}
