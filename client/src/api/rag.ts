import { apiClient } from "./client";
import type { RagQueryDto, RagResponseData, ApiResponse } from "@/types/api";

export const ragApi = {
  query: async (dto: RagQueryDto): Promise<ApiResponse<RagResponseData>> => {
    return apiClient.post<unknown, ApiResponse<RagResponseData>>("rag/query", dto);
  },

  health: async (): Promise<ApiResponse<{ status: string; module: string; timestamp: string }>> => {
    return apiClient.get<unknown, ApiResponse<{ status: string; module: string; timestamp: string }>>("rag/health");
  },

  metrics: async (): Promise<ApiResponse<{ module: string; uptime: number }>> => {
    return apiClient.get<unknown, ApiResponse<{ module: string; uptime: number }>>("rag/metrics");
  },
};
