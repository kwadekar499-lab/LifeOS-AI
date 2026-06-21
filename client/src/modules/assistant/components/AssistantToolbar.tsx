import { memo } from "react";
import {
  Brain,
  ChevronDown,
  Library,
  RotateCcw,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import { ASSISTANT_COPY } from "../constants/copy";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type AssistantToolbarProps = WithClassName & {
  memoryEnabled?: boolean;
  knowledgeEnabled?: boolean;
  onMemoryToggle?: () => void;
  onKnowledgeToggle?: () => void;
};

export const AssistantToolbar = memo(function AssistantToolbar({
  memoryEnabled = true,
  knowledgeEnabled = true,
  onMemoryToggle,
  onKnowledgeToggle,
  className,
}: AssistantToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-b border-white/[0.06] pb-4",
        className,
      )}
      role="toolbar"
      aria-label="Assistant controls"
    >
      <button
        type="button"
        className="focus-ring inline-flex items-center gap-2 rounded-xl bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-white/60 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.06] hover:text-white/80"
        aria-label={ASSISTANT_COPY.contextSelectorLabel}
        aria-haspopup="listbox"
      >
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">
          {ASSISTANT_COPY.contextSelectorPlaceholder}
        </span>
        <ChevronDown className="size-3.5 text-white/30" aria-hidden="true" />
      </button>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onMemoryToggle}
          className={cn(
            "focus-ring inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium ring-1 transition-colors",
            memoryEnabled
              ? "bg-violet-500/10 text-violet-200/80 ring-violet-500/20"
              : "bg-white/[0.04] text-white/45 ring-white/[0.06] hover:text-white/70",
          )}
          aria-label={ASSISTANT_COPY.memoryToggleLabel}
          aria-pressed={memoryEnabled}
        >
          <Brain className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">
            {ASSISTANT_COPY.memoryToggleLabel}
          </span>
        </button>

        <button
          type="button"
          onClick={onKnowledgeToggle}
          className={cn(
            "focus-ring inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium ring-1 transition-colors",
            knowledgeEnabled
              ? "bg-indigo-500/10 text-indigo-200/80 ring-indigo-500/20"
              : "bg-white/[0.04] text-white/45 ring-white/[0.06] hover:text-white/70",
          )}
          aria-label={ASSISTANT_COPY.knowledgeToggleLabel}
          aria-pressed={knowledgeEnabled}
        >
          <Library className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">
            {ASSISTANT_COPY.knowledgeToggleLabel}
          </span>
        </button>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          className="focus-ring inline-flex items-center gap-1.5 rounded-xl bg-white/[0.04] px-3 py-2 text-sm text-white/45 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.06] hover:text-white/70"
          aria-label={ASSISTANT_COPY.clearConversationLabel}
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          <span className="hidden md:inline">
            {ASSISTANT_COPY.clearConversationLabel}
          </span>
        </button>

        <button
          type="button"
          className="focus-ring rounded-xl bg-white/[0.04] p-2 text-white/45 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.06] hover:text-white/70"
          aria-label={ASSISTANT_COPY.settingsLabel}
        >
          <Settings className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
});
