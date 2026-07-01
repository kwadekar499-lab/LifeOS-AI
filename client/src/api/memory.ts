import { apiClient } from "./client";
import type { MemoryItem, CreateMemoryDto, UpdateMemoryDto, SearchMemoryDto, ApiResponse } from "@/types/api";

export const memoryApi = {
  create: async (dto: CreateMemoryDto): Promise<ApiResponse<MemoryItem>> => {
    return apiClient.post<unknown, ApiResponse<MemoryItem>>("memory", dto);
  },

  list: async (params?: { category?: string; cursor?: string; limit?: number }): Promise<ApiResponse<{ data: MemoryItem[]; nextCursor?: string; hasMore: boolean }>> => {
    return apiClient.get<unknown, ApiResponse<{ data: MemoryItem[]; nextCursor?: string; hasMore: boolean }>>("memory", { params });
  },

  search: async (params: SearchMemoryDto): Promise<ApiResponse<{ data: MemoryItem[]; nextCursor?: string; hasMore: boolean }>> => {
    return apiClient.get<unknown, ApiResponse<{ data: MemoryItem[]; nextCursor?: string; hasMore: boolean }>>("memory/search", { params });
  },

  findById: async (id: string): Promise<ApiResponse<MemoryItem>> => {
    return apiClient.get<unknown, ApiResponse<MemoryItem>>(`memory/${id}`);
  },

  update: async (id: string, dto: UpdateMemoryDto): Promise<ApiResponse<MemoryItem>> => {
    return apiClient.patch<unknown, ApiResponse<MemoryItem>>(`memory/${id}`, dto);
  },

  delete: async (id: string): Promise<ApiResponse<MemoryItem>> => {
    return apiClient.delete<unknown, ApiResponse<MemoryItem>>(`memory/${id}`);
  },

  restore: async (id: string): Promise<ApiResponse<MemoryItem>> => {
    return apiClient.post<unknown, ApiResponse<MemoryItem>>(`memory/${id}/restore`);
  },
};
