import { apiClient } from "./client";
import type { ChatRequestDto, ChatResponseData, ApiResponse } from "@/types/api";

export const assistantApi = {
  chat: async (dto: ChatRequestDto): Promise<ApiResponse<ChatResponseData>> => {
    return apiClient.post<unknown, ApiResponse<ChatResponseData>>("api/v1/assistant/chat", dto);
  },

  chatStream: async (dto: ChatRequestDto): Promise<ApiResponse<unknown>> => {
    return apiClient.post<unknown, ApiResponse<unknown>>("api/v1/assistant/chat/stream", dto);
  },
};
