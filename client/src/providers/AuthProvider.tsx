import React, { createContext, useContext, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/api/auth";
import type { User } from "@/types/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (email: string, username: string, password?: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, accessToken, refreshToken, isAuthenticated, isLoading, setAuth, clearAuth, setLoading, setError } = useAuthStore();

  useEffect(() => {
    const recoverSession = async () => {
      // If we have tokens, attempt session recovery by fetching current profile
      if (accessToken && refreshToken) {
        setLoading(true);
        try {
          const response = await authApi.getMe();
          if (response && response.success && response.data) {
            setAuth(response.data, accessToken, refreshToken);
          } else {
            clearAuth();
          }
        } catch {
          // If error is handled by interceptor and session is cleared, it's fine
          clearAuth();
        } finally {
          setLoading(false);
        }
      } else {
        // No tokens, make sure auth is cleared
        clearAuth();
      }
    };

    recoverSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      if (response && response.success && response.data) {
        const { user: userData, accessToken: access, refreshToken: refresh } = response.data;
        setAuth(userData, access, refresh);
      } else {
        throw new Error("Invalid response structure from login API");
      }
    } catch (err: unknown) {
      let errMsg = "Failed to log in";
      if (axios.isAxiosError(err)) {
        errMsg = err.response?.data?.error?.message || err.message || errMsg;
      } else if (err instanceof Error) {
        errMsg = err.message;
      }
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, username: string, password?: string, fullName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register({ email, username, password, fullName });
      if (response && response.success && response.data) {
        const { user: userData, accessToken: access, refreshToken: refresh } = response.data;
        setAuth(userData, access, refresh);
      } else {
        throw new Error("Invalid response structure from registration API");
      }
    } catch (err: unknown) {
      let errMsg = "Failed to register";
      if (axios.isAxiosError(err)) {
        errMsg = err.response?.data?.error?.message || err.message || errMsg;
      } else if (err instanceof Error) {
        errMsg = err.message;
      }
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // Ignore logout API errors, proceed to clear local state
    } finally {
      clearAuth();
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
