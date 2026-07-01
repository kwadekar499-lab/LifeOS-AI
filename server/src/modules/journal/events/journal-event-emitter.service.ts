import { Injectable, Logger } from '@nestjs/common';

export interface JournalEvent {
  journalId: string;
  userId: string;
  action: 'created' | 'updated' | 'deleted' | 'restored';
  metadata?: Record<string, unknown>;
}

@Injectable()
export class JournalEventEmitter {
  private readonly logger = new Logger(JournalEventEmitter.name);

  emitCreated(journalId: string, userId: string, metadata?: Record<string, unknown>): void {
    const event: JournalEvent = {
      journalId,
      userId,
      action: 'created',
      metadata,
    };
    this.logger.log(JSON.stringify(event));
  }

  emitUpdated(journalId: string, userId: string, metadata?: Record<string, unknown>): void {
    const event: JournalEvent = {
      journalId,
      userId,
      action: 'updated',
      metadata,
    };
    this.logger.log(JSON.stringify(event));
  }

  emitDeleted(journalId: string, userId: string, metadata?: Record<string, unknown>): void {
    const event: JournalEvent = {
      journalId,
      userId,
      action: 'deleted',
      metadata,
    };
    this.logger.log(JSON.stringify(event));
  }

  emitRestored(journalId: string, userId: string, metadata?: Record<string, unknown>): void {
    const event: JournalEvent = {
      journalId,
      userId,
      action: 'restored',
      metadata,
    };
    this.logger.log(JSON.stringify(event));
  }
}
