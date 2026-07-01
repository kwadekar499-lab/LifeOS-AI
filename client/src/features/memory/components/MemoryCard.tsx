import { memo, type KeyboardEvent } from "react";
import type { MemorySummary } from "../types";
import {
  formatMemoryStatus,
  formatMemoryType,
  formatRelativeDate,
} from "../utils/format";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type MemoryCardProps = WithClassName & {
  memory: MemorySummary;
  onSelect?: (id: string) => void;
};

export const MemoryCard = memo(function MemoryCard({
  memory,
  onSelect,
  className,
}: MemoryCardProps) {
  const handleClick = (): void => {
    onSelect?.(memory.id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(memory.id);
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Memory: ${memory.title}`}
      className={cn(
        "group flex cursor-pointer flex-col rounded-xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.05] hover:ring-white/[0.1]",
        className,
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-white/45">
          {formatMemoryType(memory.type)}
        </span>
        <span className="text-[11px] text-white/25">
          {formatRelativeDate(memory.updatedAt)}
        </span>
      </div>

      <h3 className="line-clamp-2 text-sm font-medium leading-snug text-white/90 transition-colors group-hover:text-white">
        {memory.title}
      </h3>

      <div className="mt-auto flex items-center justify-between pt-4">
        <div className="flex flex-wrap gap-1.5">
          {memory.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/40 ring-1 ring-white/[0.06]"
            >
              {tag.label}
            </span>
          ))}
        </div>
        <span className="text-[11px] text-white/30">
          {formatMemoryStatus(memory.status)}
        </span>
      </div>
    </article>
  );
});
