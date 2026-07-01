import { memo } from "react";
import { Plus } from "lucide-react";
import { KNOWLEDGE_COPY } from "../constants/copy";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type KnowledgeEmptyStateProps = WithClassName & {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

function KnowledgeGraphIllustration() {
  return (
    <div
      className="relative mx-auto mb-8 size-40"
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full bg-indigo-500/[0.06] blur-2xl" />

      <div className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.08] ring-1 ring-white/[0.12]" />

      <div className="absolute left-6 top-8 size-6 rounded-full bg-white/[0.05] ring-1 ring-white/[0.08]" />
      <div className="absolute right-5 top-10 size-5 rounded-full bg-white/[0.04] ring-1 ring-white/[0.06]" />
      <div className="absolute bottom-8 left-10 size-7 rounded-full bg-white/[0.06] ring-1 ring-white/[0.1]" />
      <div className="absolute bottom-10 right-8 size-5 rounded-full bg-white/[0.04] ring-1 ring-white/[0.06]" />

      <div className="absolute left-[2.75rem] top-[3.25rem] h-px w-12 rotate-[25deg] bg-gradient-to-r from-white/20 to-white/5" />
      <div className="absolute left-1/2 top-[3.5rem] h-px w-10 -translate-x-1/2 rotate-[-30deg] bg-gradient-to-r from-white/15 to-white/5" />
      <div className="absolute bottom-[3.5rem] left-[3.5rem] h-px w-14 rotate-[-20deg] bg-gradient-to-r from-white/20 to-white/5" />
      <div className="absolute bottom-[3.75rem] right-[3rem] h-px w-11 rotate-[35deg] bg-gradient-to-r from-white/15 to-white/5" />
    </div>
  );
}

export const KnowledgeEmptyState = memo(function KnowledgeEmptyState({
  title = KNOWLEDGE_COPY.emptyState.title,
  description = KNOWLEDGE_COPY.emptyState.description,
  actionLabel = KNOWLEDGE_COPY.emptyState.action,
  onAction,
  className,
}: KnowledgeEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      <KnowledgeGraphIllustration />

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
