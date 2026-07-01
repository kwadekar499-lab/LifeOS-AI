import { Message } from '@prisma/client';
import { PaginationParams, PaginatedResult } from './pagination.interface';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageStatusDto } from '../dto/update-message-status.dto';

export interface IMessageRepository {
  create(conversationId: string, userId: string, dto: CreateMessageDto): Promise<Message>;
  findAll(conversationId: string, params: PaginationParams): Promise<PaginatedResult<Message>>;
  findById(id: string): Promise<Message | null>;
  updateStatus(id: string, dto: UpdateMessageStatusDto): Promise<Message>;
  updateMetadata(id: string, metadata: Record<string, unknown>): Promise<Message>;
  softDelete(id: string): Promise<Message>;
  searchMessages(userId: string, query: string, limit?: number): Promise<Message[]>;
  findRecent(userId: string, limit?: number): Promise<Message[]>;
  findByConversation(conversationId: string, limit?: number): Promise<Message[]>;
}
