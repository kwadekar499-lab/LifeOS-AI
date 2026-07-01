import { apiClient } from "./client";
import type { FileUploadData, ApiResponse } from "@/types/api";

export const filesApi = {
  upload: async (
    file: File, 
    source?: "manual" | "import" | "attachment", 
    sourceUrl?: string, 
    metadata?: Record<string, unknown>
  ): Promise<ApiResponse<FileUploadData>> => {
    const formData = new FormData();
    formData.append("file", file);
    if (source) formData.append("source", source);
    if (sourceUrl) formData.append("sourceUrl", sourceUrl);
    if (metadata) formData.append("metadata", JSON.stringify(metadata));

    return apiClient.post<unknown, ApiResponse<FileUploadData>>("files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  list: async (): Promise<ApiResponse<FileUploadData[]>> => {
    return apiClient.get<unknown, ApiResponse<FileUploadData[]>>("files");
  },

  findById: async (id: string): Promise<ApiResponse<FileUploadData>> => {
    return apiClient.get<unknown, ApiResponse<FileUploadData>>(`files/${id}`);
  },

  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.delete<unknown, ApiResponse<{ message: string }>>(`files/${id}`);
  },
};
