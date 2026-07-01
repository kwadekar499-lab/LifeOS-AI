import axios from "axios";
import { useNotificationStore } from "@/stores/notificationStore";

export interface ErrorDetails {
  code: string;
  message: string;
  statusCode?: number;
}

export function handleApiError(error: unknown): ErrorDetails {
  let code = "UNKNOWN_ERROR";
  let message = "An unexpected error occurred. Please try again.";
  let statusCode = 500;

  if (axios.isAxiosError(error)) {
    statusCode = error.response?.status || 500;
    const responseData = error.response?.data;

    // Check if the response matches our standard NestJS error format
    if (responseData && typeof responseData === "object" && "error" in responseData) {
      const backendError = responseData.error;
      code = backendError.code || code;
      message = backendError.message || message;
    } else {
      // General HTTP status mapping
      code = error.code || "HTTP_ERROR";
      
      switch (statusCode) {
        case 400:
          message = "The request was invalid. Please check your inputs.";
          break;
        case 401:
          message = "Session expired. Please log in again.";
          break;
        case 403:
          message = "You do not have permission to perform this action.";
          break;
        case 404:
          message = "The requested resource could not be found.";
          break;
        case 409:
          message = "A conflict occurred. This record might already exist.";
          break;
        case 422:
          message = "The provided data is invalid or could not be processed.";
          break;
        case 429:
          message = "Too many requests. Please wait a moment before trying again.";
          break;
        case 500:
        default:
          message = "A server error occurred. Please try again later.";
          break;
      }
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  // Display user-friendly notification
  useNotificationStore.getState().addNotification(message, "error");

  return { code, message, statusCode };
}
