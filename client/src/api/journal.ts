import { apiClient } from "./client";
import type { JournalEntry, CreateJournalDto, UpdateJournalDto, ApiResponse } from "@/types/api";

export const journalApi = {
  create: async (dto: CreateJournalDto): Promise<ApiResponse<JournalEntry>> => {
    return apiClient.post<unknown, ApiResponse<JournalEntry>>("journal", dto);
  },

  list: async (params?: { cursor?: string; limit?: number }): Promise<ApiResponse<{ data: JournalEntry[]; nextCursor?: string; hasMore: boolean }>> => {
    return apiClient.get<unknown, ApiResponse<{ data: JournalEntry[]; nextCursor?: string; hasMore: boolean }>>("journal", { params });
  },

  search: async (params: { query: string; tags?: string; cursor?: string; limit?: number }): Promise<ApiResponse<{ data: JournalEntry[]; nextCursor?: string; hasMore: boolean }>> => {
    return apiClient.get<unknown, ApiResponse<{ data: JournalEntry[]; nextCursor?: string; hasMore: boolean }>>("journal/search", { params });
  },

  findById: async (id: string): Promise<ApiResponse<JournalEntry>> => {
    return apiClient.get<unknown, ApiResponse<JournalEntry>>(`journal/${id}`);
  },

  update: async (id: string, dto: UpdateJournalDto): Promise<ApiResponse<JournalEntry>> => {
    return apiClient.patch<unknown, ApiResponse<JournalEntry>>(`journal/${id}`, dto);
  },

  delete: async (id: string): Promise<ApiResponse<JournalEntry>> => {
    return apiClient.delete<unknown, ApiResponse<JournalEntry>>(`journal/${id}`);
  },

  restore: async (id: string): Promise<ApiResponse<JournalEntry>> => {
    return apiClient.post<unknown, ApiResponse<JournalEntry>>(`journal/${id}/restore`);
  },

  findByDate: async (date: string): Promise<ApiResponse<JournalEntry[]>> => {
    return apiClient.get<unknown, ApiResponse<JournalEntry[]>>(`journal/date/${date}`);
  },

  findRange: async (start: string, end: string): Promise<ApiResponse<JournalEntry[]>> => {
    return apiClient.get<unknown, ApiResponse<JournalEntry[]>>("journal/range", { params: { start, end } });
  },
};
