import { memo } from "react";
import { Filter, Plus, Search } from "lucide-react";
import { MEMORY_COPY } from "../constants/copy";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type MemoryToolbarProps = WithClassName & {
  searchPlaceholder?: string;
  onNewMemory?: () => void;
};

export const MemoryToolbar = memo(function MemoryToolbar({
  searchPlaceholder = MEMORY_COPY.searchPlaceholder,
  onNewMemory,
  className,
}: MemoryToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center",
        className,
      )}
      role="toolbar"
      aria-label="Memory actions"
    >
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder={searchPlaceholder}
          readOnly
          aria-label="Search memories"
          className="focus-ring w-full rounded-xl bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.06]"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="focus-ring inline-flex items-center gap-2 rounded-xl bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/60 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.06] hover:text-white/80"
          aria-label={MEMORY_COPY.filterLabel}
        >
          <Filter className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{MEMORY_COPY.filterLabel}</span>
        </button>

        <button
          type="button"
          onClick={onNewMemory}
          className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[#0A0A0F] transition-shadow hover:shadow-[0_0_24px_rgba(255,255,255,0.1)] sm:flex-none"
          aria-label={MEMORY_COPY.newMemoryLabel}
        >
          <Plus className="size-4" aria-hidden="true" />
          {MEMORY_COPY.newMemoryLabel}
        </button>
      </div>
    </div>
  );
});
