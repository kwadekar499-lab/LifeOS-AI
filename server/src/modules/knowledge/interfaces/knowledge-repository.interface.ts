import { Knowledge } from '../entities/knowledge.entity';
import { PaginatedResult, PaginationParams } from '../types';

export interface SearchKnowledgeParams {
  query?: string;
  category?: string;
  tags?: string[];
  source?: string;
  cursor?: string;
  limit?: number;
}

export interface ListKnowledgeParams extends PaginationParams {
  category?: string;
  source?: string;
}

export interface FindRelevantParams {
  query: string;
  limit?: number;
}

export interface IKnowledgeRepository {
  create(userId: string, data: CreateKnowledgeData): Promise<Knowledge>;
  update(id: string, userId: string, data: UpdateKnowledgeData): Promise<Knowledge>;
  softDelete(id: string, userId: string): Promise<Knowledge>;
  restore(id: string, userId: string): Promise<Knowledge>;
  findById(id: string, userId: string): Promise<Knowledge | null>;
  search(userId: string, params: SearchKnowledgeParams): Promise<PaginatedResult<Knowledge>>;
  list(userId: string, params: ListKnowledgeParams): Promise<PaginatedResult<Knowledge>>;
  findRelevant(userId: string, params: FindRelevantParams): Promise<Knowledge[]>;
}

export interface CreateKnowledgeData {
  title: string;
  content: string;
  summary?: string;
  category?: string;
  tags?: string[];
  source?: string;
  sourceUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateKnowledgeData {
  title?: string;
  content?: string;
  summary?: string;
  category?: string;
  tags?: string[];
  source?: string;
  sourceUrl?: string;
  metadata?: Record<string, unknown>;
}
