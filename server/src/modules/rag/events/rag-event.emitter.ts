import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  RAGEventType,
  RAGStartedPayload,
  RAGCompletedPayload,
  RAGFailedPayload,
  ContextMergedPayload,
  SemanticSearchCompletedPayload,
} from './rag.events';

@Injectable()
export class RAGEventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitStarted(payload: RAGStartedPayload): void {
    this.eventEmitter.emit(RAGEventType.STARTED, payload);
  }

  emitCompleted(payload: RAGCompletedPayload): void {
    this.eventEmitter.emit(RAGEventType.COMPLETED, payload);
  }

  emitFailed(payload: RAGFailedPayload): void {
    this.eventEmitter.emit(RAGEventType.FAILED, payload);
  }

  emitContextMerged(payload: ContextMergedPayload): void {
    this.eventEmitter.emit(RAGEventType.CONTEXT_MERGED, payload);
  }

  emitSemanticSearchCompleted(payload: SemanticSearchCompletedPayload): void {
    this.eventEmitter.emit(RAGEventType.SEMANTIC_SEARCH_COMPLETED, payload);
  }
}
