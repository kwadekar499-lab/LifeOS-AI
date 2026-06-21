import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { APP_NAME } from "@/constants/app";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, errorInfo);
    }
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0F] px-6 text-center text-white"
          role="alert"
          aria-live="assertive"
        >
          <AlertTriangle
            className="mb-6 size-10 text-white/40"
            aria-hidden="true"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/50">
            {APP_NAME} encountered an unexpected error. Please try again.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="focus-ring mt-8 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
