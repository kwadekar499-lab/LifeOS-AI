import { Injectable, Logger } from '@nestjs/common';
import { StreamEvent } from '../interfaces/stream-event.interface';

@Injectable()
export class StreamEventEmitter {
  private readonly logger = new Logger(StreamEventEmitter.name);
  private listeners: Map<string, Set<(event: StreamEvent) => void>> = new Map();

  subscribe(streamId: string, callback: (event: StreamEvent) => void): () => void {
    if (!this.listeners.has(streamId)) {
      this.listeners.set(streamId, new Set());
    }

    this.listeners.get(streamId)!.add(callback);

    this.logger.debug(`Subscribed to stream: ${streamId}`);

    return () => {
      this.listeners.get(streamId)?.delete(callback);
      this.logger.debug(`Unsubscribed from stream: ${streamId}`);
    };
  }

  emit(streamId: string, event: StreamEvent): void {
    const listeners = this.listeners.get(streamId);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(event);
        } catch (error) {
          this.logger.error(`Error in stream event listener for ${streamId}: ${error}`);
        }
      });
    }
  }

  complete(streamId: string): void {
    this.listeners.delete(streamId);
    this.logger.debug(`Stream completed and cleaned up: ${streamId}`);
  }
}
