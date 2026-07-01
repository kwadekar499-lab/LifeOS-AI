import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MemoryEvent } from './memory-event.interface';
import { MEMORY_EVENTS } from '../constants/defaults';

@Injectable()
export class MemoryEventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitCreated(memoryId: string, userId: string, metadata?: Record<string, unknown>): void {
    this.emit({
      type: MEMORY_EVENTS.CREATED,
      memoryId,
      userId,
      metadata,
      timestamp: new Date(),
    });
  }

  emitUpdated(memoryId: string, userId: string, metadata?: Record<string, unknown>): void {
    this.emit({
      type: MEMORY_EVENTS.UPDATED,
      memoryId,
      userId,
      metadata,
      timestamp: new Date(),
    });
  }

  emitDeleted(memoryId: string, userId: string, metadata?: Record<string, unknown>): void {
    this.emit({
      type: MEMORY_EVENTS.DELETED,
      memoryId,
      userId,
      metadata,
      timestamp: new Date(),
    });
  }

  emitRestored(memoryId: string, userId: string, metadata?: Record<string, unknown>): void {
    this.emit({
      type: MEMORY_EVENTS.RESTORED,
      memoryId,
      userId,
      metadata,
      timestamp: new Date(),
    });
  }

  private emit(event: MemoryEvent): void {
    this.eventEmitter.emit(event.type, event);
  }
}
