import { create } from "zustand";
import type { User } from "@/types/api";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem("lifeos_access_token"),
  refreshToken: localStorage.getItem("lifeos_refresh_token"),
  isAuthenticated: !!localStorage.getItem("lifeos_access_token"),
  isLoading: false,
  error: null,

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem("lifeos_access_token", accessToken);
    localStorage.setItem("lifeos_refresh_token", refreshToken);
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      error: null,
    });
  },

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("lifeos_access_token", accessToken);
    localStorage.setItem("lifeos_refresh_token", refreshToken);
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    localStorage.removeItem("lifeos_access_token");
    localStorage.removeItem("lifeos_refresh_token");
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
