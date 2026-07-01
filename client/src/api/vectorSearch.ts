import { apiClient } from "./client";
import type { SearchVectorDto, BatchSearchVectorDto, VectorSearchResponse, ApiResponse } from "@/types/api";

export const vectorSearchApi = {
  search: async (dto: SearchVectorDto): Promise<ApiResponse<VectorSearchResponse>> => {
    return apiClient.post<unknown, ApiResponse<VectorSearchResponse>>("vector/search", dto);
  },

  searchBatch: async (dto: BatchSearchVectorDto): Promise<ApiResponse<VectorSearchResponse[]>> => {
    return apiClient.post<unknown, ApiResponse<VectorSearchResponse[]>>("vector/search/batch", dto);
  },

  getProviders: async (): Promise<ApiResponse<string[]>> => {
    return apiClient.get<unknown, ApiResponse<string[]>>("vector/providers");
  },

  health: async (): Promise<ApiResponse<{ healthy: boolean; provider: string }>> => {
    return apiClient.get<unknown, ApiResponse<{ healthy: boolean; provider: string }>>("vector/health");
  },
};
