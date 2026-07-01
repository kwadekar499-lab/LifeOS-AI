import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VectorSearchEventType, VectorSearchEventPayload } from '../types/vector-search-event.type';

@Injectable()
export class VectorSearchEventEmitter {
  constructor(private eventEmitter: EventEmitter2) {}

  emitStarted(payload: VectorSearchEventPayload): void {
    this.eventEmitter.emit(VectorSearchEventType.SEARCH_STARTED, payload);
  }

  emitCompleted(payload: VectorSearchEventPayload): void {
    this.eventEmitter.emit(VectorSearchEventType.SEARCH_COMPLETED, payload);
  }

  emitFailed(payload: VectorSearchEventPayload & { error: string }): void {
    this.eventEmitter.emit(VectorSearchEventType.SEARCH_FAILED, payload);
  }

  emitBatchStarted(payload: VectorSearchEventPayload): void {
    this.eventEmitter.emit(VectorSearchEventType.BATCH_STARTED, payload);
  }

  emitBatchCompleted(payload: VectorSearchEventPayload): void {
    this.eventEmitter.emit(VectorSearchEventType.BATCH_COMPLETED, payload);
  }

  emitBatchFailed(payload: VectorSearchEventPayload & { error: string }): void {
    this.eventEmitter.emit(VectorSearchEventType.BATCH_FAILED, payload);
  }
}
