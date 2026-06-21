import { memo } from "react";
import {
  ArrowDownUp,
  Filter,
  LayoutGrid,
  List,
  Plus,
  Search,
} from "lucide-react";
import { KNOWLEDGE_COPY } from "../constants/copy";
import type { KnowledgeViewMode } from "../types";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type KnowledgeToolbarProps = WithClassName & {
  searchPlaceholder?: string;
  viewMode?: KnowledgeViewMode;
  onViewModeChange?: (mode: KnowledgeViewMode) => void;
  onNewKnowledge?: () => void;
};

export const KnowledgeToolbar = memo(function KnowledgeToolbar({
  searchPlaceholder = KNOWLEDGE_COPY.searchPlaceholder,
  viewMode = "grid",
  onViewModeChange,
  onNewKnowledge,
  className,
}: KnowledgeToolbarProps) {
  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      role="toolbar"
      aria-label="Knowledge actions"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder={searchPlaceholder}
            readOnly
            aria-label="Search knowledge"
            className="focus-ring w-full rounded-xl bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.06]"
          />
        </div>

        <button
          type="button"
          onClick={onNewKnowledge}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[#0A0A0F] transition-shadow hover:shadow-[0_0_24px_rgba(255,255,255,0.1)] sm:shrink-0"
          aria-label={KNOWLEDGE_COPY.newKnowledgeLabel}
        >
          <Plus className="size-4" aria-hidden="true" />
          {KNOWLEDGE_COPY.newKnowledgeLabel}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="focus-ring inline-flex items-center gap-2 rounded-xl bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-white/60 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.06] hover:text-white/80"
          aria-label={KNOWLEDGE_COPY.filterLabel}
        >
          <Filter className="size-4" aria-hidden="true" />
          {KNOWLEDGE_COPY.filterLabel}
        </button>

        <button
          type="button"
          className="focus-ring inline-flex items-center gap-2 rounded-xl bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-white/60 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.06] hover:text-white/80"
          aria-label={KNOWLEDGE_COPY.sortLabel}
        >
          <ArrowDownUp className="size-4" aria-hidden="true" />
          {KNOWLEDGE_COPY.sortLabel}
        </button>

        <div
          className="ml-auto flex items-center rounded-xl bg-white/[0.04] p-1 ring-1 ring-white/[0.06]"
          role="group"
          aria-label="View mode"
        >
          <button
            type="button"
            onClick={() => onViewModeChange?.("grid")}
            className={cn(
              "focus-ring inline-flex items-center justify-center rounded-lg p-2 transition-colors",
              viewMode === "grid"
                ? "bg-white/[0.08] text-white"
                : "text-white/40 hover:text-white/70",
            )}
            aria-label={KNOWLEDGE_COPY.viewGridLabel}
            aria-pressed={viewMode === "grid"}
          >
            <LayoutGrid className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange?.("list")}
            className={cn(
              "focus-ring inline-flex items-center justify-center rounded-lg p-2 transition-colors",
              viewMode === "list"
                ? "bg-white/[0.08] text-white"
                : "text-white/40 hover:text-white/70",
            )}
            aria-label={KNOWLEDGE_COPY.viewListLabel}
            aria-pressed={viewMode === "list"}
          >
            <List className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
});
