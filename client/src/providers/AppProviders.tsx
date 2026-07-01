import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { AuthProvider } from "./AuthProvider";
import type { WithChildren } from "@/types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: unknown) => {
        // Do not retry 401/403 unauthorized errors
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

export function AppProviders({ children }: WithChildren) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

