import { apiClient } from "./client";
import type { LoginDto, RegisterDto, AuthData, User, ApiResponse } from "@/types/api";

export const authApi = {
  login: async (dto: LoginDto): Promise<ApiResponse<AuthData>> => {
    return apiClient.post<unknown, ApiResponse<AuthData>>("/auth/login", dto);
  },

  register: async (dto: RegisterDto): Promise<ApiResponse<AuthData>> => {
    return apiClient.post<unknown, ApiResponse<AuthData>>("/auth/register", dto);
  },

  logout: async (refreshToken?: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<unknown, ApiResponse<{ message: string }>>("/auth/logout", { refreshToken });
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    return apiClient.get<unknown, ApiResponse<User>>("/auth/me");
  },
};
