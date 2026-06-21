import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import type { WithChildren } from "@/types";

export function AppProviders({ children }: WithChildren) {
  return (
    <ErrorBoundary>
      <BrowserRouter>{children}</BrowserRouter>
    </ErrorBoundary>
  );
}
