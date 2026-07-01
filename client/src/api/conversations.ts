import { apiClient } from "./client";
import type { Conversation, Message, CreateConversationDto, UpdateConversationDto, ApiResponse } from "@/types/api";

export interface PaginatedResult<T> {
  data: T[];
  nextCursor?: string | null;
  hasMore: boolean;
}

export const conversationsApi = {
  create: async (dto: CreateConversationDto): Promise<ApiResponse<Conversation>> => {
    return apiClient.post<unknown, ApiResponse<Conversation>>("conversations", dto);
  },

  list: async (params?: { limit?: number; cursor?: string }): Promise<ApiResponse<PaginatedResult<Conversation>>> => {
    return apiClient.get<unknown, ApiResponse<PaginatedResult<Conversation>>>("conversations", { params });
  },

  search: async (params: { query: string; tags?: string; cursor?: string; limit?: number }): Promise<ApiResponse<PaginatedResult<Conversation>>> => {
    return apiClient.get<unknown, ApiResponse<PaginatedResult<Conversation>>>("conversations/search", { params });
  },

  findById: async (id: string): Promise<ApiResponse<Conversation>> => {
    return apiClient.get<unknown, ApiResponse<Conversation>>(`conversations/${id}`);
  },

  update: async (id: string, dto: UpdateConversationDto): Promise<ApiResponse<Conversation>> => {
    return apiClient.patch<unknown, ApiResponse<Conversation>>(`conversations/${id}`, dto);
  },

  delete: async (id: string): Promise<ApiResponse<Conversation>> => {
    return apiClient.delete<unknown, ApiResponse<Conversation>>(`conversations/${id}`);
  },

  archive: async (id: string): Promise<ApiResponse<Conversation>> => {
    return apiClient.post<unknown, ApiResponse<Conversation>>(`conversations/${id}/archive`);
  },

  pin: async (id: string): Promise<ApiResponse<Conversation>> => {
    return apiClient.post<unknown, ApiResponse<Conversation>>(`conversations/${id}/pin`);
  },

  unpin: async (id: string): Promise<ApiResponse<Conversation>> => {
    return apiClient.delete<unknown, ApiResponse<Conversation>>(`conversations/${id}/pin`);
  },

  restore: async (id: string): Promise<ApiResponse<Conversation>> => {
    return apiClient.post<unknown, ApiResponse<Conversation>>(`conversations/${id}/restore`);
  },

  getMessages: async (conversationId: string, params?: { limit?: number; cursor?: string }): Promise<ApiResponse<PaginatedResult<Message>>> => {
    return apiClient.get<unknown, ApiResponse<PaginatedResult<Message>>>(`conversations/${conversationId}/messages`, { params });
  },
};
