import { apiClient } from "./client";
import type { EmbeddingMetadata, GenerateEmbeddingDto, ApiResponse } from "@/types/api";

export const embeddingsApi = {
  generateForFile: async (fileId: string, dto?: GenerateEmbeddingDto): Promise<ApiResponse<unknown>> => {
    return apiClient.post<unknown, ApiResponse<unknown>>(`embeddings/generate/${fileId}`, dto || {});
  },

  generateForChunk: async (chunkId: string): Promise<ApiResponse<unknown>> => {
    return apiClient.post<unknown, ApiResponse<unknown>>(`embeddings/chunk/${chunkId}`);
  },

  getByFile: async (fileId: string): Promise<ApiResponse<EmbeddingMetadata[]>> => {
    return apiClient.get<unknown, ApiResponse<EmbeddingMetadata[]>>(`embeddings/${fileId}`);
  },

  getProviders: async (): Promise<ApiResponse<string[]>> => {
    return apiClient.get<unknown, ApiResponse<string[]>>("embeddings/providers");
  },
};
