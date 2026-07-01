import { memo } from "react";
import { MemoryCard } from "./MemoryCard";
import { MemoryEmptyState } from "./MemoryEmptyState";
import type { MemorySummary } from "../types";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type MemoryGridProps = WithClassName & {
  memories: MemorySummary[];
  onMemorySelect?: (id: string) => void;
  onCreateMemory?: () => void;
};

export const MemoryGrid = memo(function MemoryGrid({
  memories,
  onMemorySelect,
  onCreateMemory,
  className,
}: MemoryGridProps) {
  if (memories.length === 0) {
    return (
      <MemoryEmptyState
        className={className}
        onAction={onCreateMemory}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
      role="list"
      aria-label="Memories"
    >
      {memories.map((memory) => (
        <div key={memory.id} role="listitem">
          <MemoryCard memory={memory} onSelect={onMemorySelect} />
        </div>
      ))}
    </div>
  );
});
