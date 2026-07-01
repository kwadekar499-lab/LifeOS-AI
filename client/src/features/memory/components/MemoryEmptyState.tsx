import { memo } from "react";
import { Brain, Plus } from "lucide-react";
import { MEMORY_COPY } from "../constants/copy";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type MemoryEmptyStateProps = WithClassName & {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const MemoryEmptyState = memo(function MemoryEmptyState({
  title = MEMORY_COPY.emptyState.title,
  description = MEMORY_COPY.emptyState.description,
  actionLabel = MEMORY_COPY.emptyState.action,
  onAction,
  className,
}: MemoryEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      <div className="relative mb-8">
        <div
          className="absolute inset-0 scale-150 rounded-full bg-violet-500/[0.06] blur-2xl"
          aria-hidden="true"
        />
        <div className="relative flex size-16 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08]">
          <Brain className="size-7 text-white/35" aria-hidden="true" />
        </div>
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-white">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-white/40">
        {description}
      </p>

      <button
        type="button"
        disabled
        title="Coming Soon"
        onClick={onAction}
        className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-white/70 ring-1 ring-white/[0.08] transition-colors hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={actionLabel}
      >
        <Plus className="size-4" aria-hidden="true" />
        {actionLabel}
      </button>
    </div>
  );
});
