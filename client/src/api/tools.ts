import { apiClient } from "./client";
import type { Tool, ApiResponse } from "@/types/api";

export const toolsApi = {
  list: async (): Promise<ApiResponse<Tool[]>> => {
    return apiClient.get<unknown, ApiResponse<Tool[]>>("tools");
  },

  getMetadata: async (): Promise<ApiResponse<unknown>> => {
    return apiClient.get<unknown, ApiResponse<unknown>>("tools/metadata");
  },

  getCategories: async (): Promise<ApiResponse<string[]>> => {
    return apiClient.get<unknown, ApiResponse<string[]>>("tools/categories");
  },

  getVersion: async (): Promise<ApiResponse<{ version: string }>> => {
    return apiClient.get<unknown, ApiResponse<{ version: string }>>("tools/version");
  },

  find: async (id: string): Promise<ApiResponse<{ found: boolean; tool?: Tool; message?: string }>> => {
    return apiClient.get<unknown, ApiResponse<{ found: boolean; tool?: Tool; message?: string }>>(`tools/${id}`);
  },

  register: async (dto: Omit<Tool, "enabled"> & { enabled?: boolean }): Promise<ApiResponse<{ success: boolean; toolId: string }>> => {
    return apiClient.post<unknown, ApiResponse<{ success: boolean; toolId: string }>>("tools", dto);
  },

  enable: async (id: string): Promise<ApiResponse<{ success: boolean; toolId: string; enabled: boolean }>> => {
    return apiClient.patch<unknown, ApiResponse<{ success: boolean; toolId: string; enabled: boolean }>>(`tools/${id}/enable`);
  },

  disable: async (id: string): Promise<ApiResponse<{ success: boolean; toolId: string; enabled: boolean }>> => {
    return apiClient.patch<unknown, ApiResponse<{ success: boolean; toolId: string; enabled: boolean }>>(`tools/${id}/disable`);
  },

  unregister: async (id: string): Promise<ApiResponse<{ success: boolean; toolId: string }>> => {
    return apiClient.delete<unknown, ApiResponse<{ success: boolean; toolId: string }>>(`tools/${id}`);
  },

  execute: async (tool: string, params: Record<string, unknown>): Promise<ApiResponse<{ success: boolean; data: unknown; tool: string }>> => {
    return apiClient.post<unknown, ApiResponse<{ success: boolean; data: unknown; tool: string }>>("tools/execute", { tool, params });
  },
};
