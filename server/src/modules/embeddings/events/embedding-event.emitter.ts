import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmbeddingEventPayload, EmbeddingEventType } from '../types/embedding-event.type';

@Injectable()
export class EmbeddingEventEmitter {
  constructor(private eventEmitter: EventEmitter2) {}

  emitStarted(payload: EmbeddingEventPayload): void {
    this.eventEmitter.emit(EmbeddingEventType.STARTED, payload);
  }

  emitCompleted(payload: EmbeddingEventPayload): void {
    this.eventEmitter.emit(EmbeddingEventType.COMPLETED, payload);
  }

  emitFailed(payload: EmbeddingEventPayload & { error: string }): void {
    this.eventEmitter.emit(EmbeddingEventType.FAILED, payload);
  }

  emitBatchStarted(payload: EmbeddingEventPayload): void {
    this.eventEmitter.emit(EmbeddingEventType.BATCH_STARTED, payload);
  }

  emitBatchCompleted(payload: EmbeddingEventPayload): void {
    this.eventEmitter.emit(EmbeddingEventType.BATCH_COMPLETED, payload);
  }

  emitBatchFailed(payload: EmbeddingEventPayload & { error: string }): void {
    this.eventEmitter.emit(EmbeddingEventType.BATCH_FAILED, payload);
  }
}
