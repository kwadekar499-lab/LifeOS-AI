import { apiClient } from "./client";
import type { DocumentParserData, DocumentChunk, ApiResponse } from "@/types/api";

export const parserApi = {
  parse: async (fileId: string, requestId?: string): Promise<ApiResponse<DocumentParserData>> => {
    return apiClient.post<unknown, ApiResponse<DocumentParserData>>(`parser/${fileId}/parse`, { requestId });
  },

  getDocument: async (fileId: string): Promise<ApiResponse<unknown>> => {
    return apiClient.get<unknown, ApiResponse<unknown>>(`parser/${fileId}/document`);
  },

  getChunks: async (fileId: string): Promise<ApiResponse<DocumentChunk[]>> => {
    return apiClient.get<unknown, ApiResponse<DocumentChunk[]>>(`parser/${fileId}/chunks`);
  },

  deleteDocument: async (fileId: string): Promise<ApiResponse<{ success: boolean }>> => {
    return apiClient.delete<unknown, ApiResponse<{ success: boolean }>>(`parser/${fileId}`);
  },

  getSupportedParsers: async (): Promise<ApiResponse<string[]>> => {
    return apiClient.get<unknown, ApiResponse<string[]>>("parser/supported");
  },
};
