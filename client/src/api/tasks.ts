import { apiClient } from "./client";
import type { Task, CreateTaskDto, UpdateTaskDto, ApiResponse } from "@/types/api";

export const tasksApi = {
  create: async (dto: CreateTaskDto): Promise<ApiResponse<Task>> => {
    return apiClient.post<unknown, ApiResponse<Task>>("tasks", dto);
  },

  list: async (params?: { status?: string; priority?: string; limit?: number }): Promise<ApiResponse<Task[]>> => {
    return apiClient.get<unknown, ApiResponse<Task[]>>("tasks", { params });
  },

  findById: async (id: string): Promise<ApiResponse<Task>> => {
    return apiClient.get<unknown, ApiResponse<Task>>(`tasks/${id}`);
  },

  update: async (id: string, dto: UpdateTaskDto): Promise<ApiResponse<Task>> => {
    return apiClient.patch<unknown, ApiResponse<Task>>(`tasks/${id}`, dto);
  },

  delete: async (id: string): Promise<ApiResponse<Task>> => {
    return apiClient.delete<unknown, ApiResponse<Task>>(`tasks/${id}`);
  },
};
