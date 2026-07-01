import { Memory } from '@prisma/client';
import { PaginatedResult, PaginationParams } from '../types/pagination.type';

export interface SearchMemoryParams {
  query?: string;
  category?: string;
  tags?: string[];
  importanceMin?: number;
  importanceMax?: number;
  cursor?: string;
  limit?: number;
}

export interface ListMemoryParams extends PaginationParams {
  category?: string;
}

export interface FindRelevantParams {
  query: string;
  limit?: number;
}

export interface IMemoryRepository {
  create(userId: string, data: CreateMemoryData): Promise<Memory>;
  update(id: string, userId: string, data: UpdateMemoryData): Promise<Memory>;
  softDelete(id: string, userId: string): Promise<Memory>;
  restore(id: string, userId: string): Promise<Memory>;
  findById(id: string, userId: string): Promise<Memory | null>;
  search(userId: string, params: SearchMemoryParams): Promise<PaginatedResult<Memory>>;
  list(userId: string, params: ListMemoryParams): Promise<PaginatedResult<Memory>>;
  findRelevant(userId: string, params: FindRelevantParams): Promise<Memory[]>;
}

export interface CreateMemoryData {
  title: string;
  content: string;
  category?: string;
  importance?: number;
  tags?: string[];
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateMemoryData {
  title?: string;
  content?: string;
  category?: string;
  importance?: number;
  tags?: string[];
  source?: string;
  metadata?: Record<string, unknown>;
}
