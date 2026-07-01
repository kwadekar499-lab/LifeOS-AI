import axios, { AxiosError } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/authStore";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to track token refresh state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

// Process the waiting requests queue
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach bearer token to outbound requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Unwrap data envelope and handle session refresh
apiClient.interceptors.response.use(
  (response) => {
    // If the response is wrapped by NestJS TransformInterceptor, unwrap it
    if (response.data && response.data.success === true && "data" in response.data) {
      return response.data; // Return the standard response envelope { success, data, meta }
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Handle 401 Unauthorized errors and attempt token refresh
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject: (err: unknown) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        useAuthStore.getState().clearAuth();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Send raw axios call to avoid interceptor loop
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        // The endpoint is wrapped by NestJS, so structure is response.data.data
        const data = response.data.data || response.data;
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        if (newAccessToken && newRefreshToken) {
          useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);
          processQueue(null, newAccessToken);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        } else {
          throw new Error("Invalid token refresh response");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
