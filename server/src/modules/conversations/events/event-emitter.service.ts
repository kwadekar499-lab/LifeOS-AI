import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEvent } from '../interfaces/conversation-event.interface';

@Injectable()
export class ConversationEventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit(event: DomainEvent): void {
    this.eventEmitter.emit(event.type, event);
  }
}
