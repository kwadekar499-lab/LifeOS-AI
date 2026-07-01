import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Message } from '@prisma/client';
import { MessageRepository } from '../repositories/message.repository';
import { ConversationRepository } from '../repositories/conversation.repository';
import { ConversationEventEmitter } from '../events/event-emitter.service';
import { PaginationParams, PaginatedResult } from '../interfaces/pagination.interface';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageStatusDto } from '../dto/update-message-status.dto';
import { MessageEventType, MessageEvent } from '../interfaces/conversation-event.interface';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly eventEmitter: ConversationEventEmitter
  ) {}

  async create(conversationId: string, userId: string, dto: CreateMessageDto): Promise<Message> {
    const conversation = await this.conversationRepository.findById(conversationId, userId);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const message = await this.messageRepository.create(conversationId, userId, dto);

    this.emitEvent({
      type: MessageEventType.CREATED,
      messageId: message.id,
      conversationId,
      userId,
      timestamp: new Date(),
      data: { role: dto.role },
    });

    return message;
  }

  async findAll(conversationId: string, userId: string, params: PaginationParams): Promise<PaginatedResult<Message>> {
    const conversation = await this.conversationRepository.findById(conversationId, userId);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.messageRepository.findAll(conversationId, params);
  }

  async updateStatus(messageId: string, userId: string, dto: UpdateMessageStatusDto): Promise<Message> {
    const message = await this.messageRepository.findById(messageId);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.userId !== userId) {
      throw new ForbiddenException('Cannot modify messages from other users');
    }

    const updated = await this.messageRepository.updateStatus(messageId, dto);

    this.emitEvent({
      type: MessageEventType.UPDATED,
      messageId: updated.id,
      conversationId: updated.conversationId,
      userId,
      timestamp: new Date(),
      data: { status: dto.status },
    });

    return updated;
  }

  async softDelete(messageId: string, userId: string): Promise<Message> {
    const message = await this.messageRepository.findById(messageId);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.userId !== userId) {
      throw new ForbiddenException('Cannot delete messages from other users');
    }

    const deleted = await this.messageRepository.softDelete(messageId);

    this.emitEvent({
      type: MessageEventType.DELETED,
      messageId: deleted.id,
      conversationId: deleted.conversationId,
      userId,
      timestamp: new Date(),
    });

    return deleted;
  }

  private emitEvent(event: MessageEvent): void {
    this.eventEmitter.emit(event);
  }
}
