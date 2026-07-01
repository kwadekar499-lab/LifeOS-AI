import { JournalEntryEntity } from '../entities';
import type { PaginatedResult } from '../types/pagination.type';

export interface JournalRepository {
  create(userId: string, data: Partial<JournalEntryEntity>): Promise<JournalEntryEntity>;
  findById(id: string, userId: string): Promise<JournalEntryEntity | null>;
  list(userId: string, options?: { cursor?: string; limit?: number }): Promise<PaginatedResult<JournalEntryEntity>>;
  search(
    userId: string,
    query: string,
    options?: { tags?: string[]; cursor?: string; limit?: number }
  ): Promise<PaginatedResult<JournalEntryEntity>>;
  update(id: string, userId: string, data: Partial<JournalEntryEntity>): Promise<JournalEntryEntity>;
  softDelete(id: string, userId: string): Promise<JournalEntryEntity>;
  restore(id: string, userId: string): Promise<JournalEntryEntity>;
  findRelevant(userId: string, query: string, limit?: number): Promise<JournalEntryEntity[]>;
  findByDate(userId: string, date: Date): Promise<JournalEntryEntity[]>;
  findRange(userId: string, startDate: Date, endDate: Date): Promise<JournalEntryEntity[]>;
}
