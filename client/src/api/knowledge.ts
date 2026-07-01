import { apiClient } from "./client";
import type { KnowledgeItem, CreateKnowledgeDto, UpdateKnowledgeDto, ApiResponse } from "@/types/api";

export const knowledgeApi = {
  create: async (dto: CreateKnowledgeDto): Promise<ApiResponse<KnowledgeItem>> => {
    return apiClient.post<unknown, ApiResponse<KnowledgeItem>>("knowledge", dto);
  },

  list: async (params?: { category?: string; cursor?: string; limit?: number }): Promise<ApiResponse<{ data: KnowledgeItem[]; nextCursor?: string; hasMore: boolean }>> => {
    return apiClient.get<unknown, ApiResponse<{ data: KnowledgeItem[]; nextCursor?: string; hasMore: boolean }>>("knowledge", { params });
  },

  search: async (params: { q: string; category?: string; tags?: string[]; cursor?: string; limit?: number }): Promise<ApiResponse<{ data: KnowledgeItem[]; nextCursor?: string; hasMore: boolean }>> => {
    return apiClient.get<unknown, ApiResponse<{ data: KnowledgeItem[]; nextCursor?: string; hasMore: boolean }>>("knowledge/search", { params });
  },

  findById: async (id: string): Promise<ApiResponse<KnowledgeItem>> => {
    return apiClient.get<unknown, ApiResponse<KnowledgeItem>>(`knowledge/${id}`);
  },

  update: async (id: string, dto: UpdateKnowledgeDto): Promise<ApiResponse<KnowledgeItem>> => {
    return apiClient.patch<unknown, ApiResponse<KnowledgeItem>>(`knowledge/${id}`, dto);
  },

  delete: async (id: string): Promise<ApiResponse<KnowledgeItem>> => {
    return apiClient.delete<unknown, ApiResponse<KnowledgeItem>>(`knowledge/${id}`);
  },

  restore: async (id: string): Promise<ApiResponse<KnowledgeItem>> => {
    return apiClient.post<unknown, ApiResponse<KnowledgeItem>>(`knowledge/${id}/restore`);
  },
};
