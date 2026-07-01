import { Conversation } from '@prisma/client';
import { PaginationParams, PaginatedResult } from './pagination.interface';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { UpdateConversationDto } from '../dto/update-conversation.dto';
import { SearchConversationsDto } from '../dto/search-conversations.dto';

export interface IConversationRepository {
  create(userId: string, dto: CreateConversationDto): Promise<Conversation>;
  findById(id: string, userId: string): Promise<Conversation | null>;
  findAll(userId: string, params: PaginationParams): Promise<PaginatedResult<Conversation>>;
  search(userId: string, dto: SearchConversationsDto): Promise<PaginatedResult<Conversation>>;
  update(id: string, userId: string, dto: UpdateConversationDto): Promise<Conversation>;
  archive(id: string, userId: string): Promise<Conversation>;
  pin(id: string, userId: string): Promise<Conversation>;
  unpin(id: string, userId: string): Promise<Conversation>;
  softDelete(id: string, userId: string): Promise<Conversation>;
  restore(id: string, userId: string): Promise<Conversation>;
  findRecent(userId: string, limit?: number): Promise<Conversation[]>;
}
