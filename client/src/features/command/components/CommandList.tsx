import React, { useMemo } from "react";
import type { UseCommandPaletteReturn } from "../hooks/useCommandPalette";
import { CommandGroupComponent } from "./CommandGroup";

interface CommandListProps {
  palette: UseCommandPaletteReturn;
}

export const CommandList = React.memo(function CommandList({ palette }: CommandListProps) {
  const { groupedItems, flatItems } = palette;

  const groupStartIndices = useMemo(() => {
    const indices: Record<string, number> = {};
    let currentIndex = 0;
    for (const group of groupedItems) {
      indices[group.category] = currentIndex;
      currentIndex += group.items.length;
    }
    return indices;
  }, [groupedItems]);

  if (flatItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06]">
          <svg
            className="size-4 text-white/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-white/60">No results found</p>
        <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-white/30">
          No commands match your search. Try a different keyword.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={palette.listRef}
      role="listbox"
      aria-label="Commands"
      className="max-h-[min(50vh,400px)] overflow-y-auto py-2"
    >
      {groupedItems.map((group) => (
        <CommandGroupComponent
          key={group.category}
          label={group.label}
          items={group.items}
          palette={palette}
          startIndex={groupStartIndices[group.category] ?? 0}
        />
      ))}
    </div>
  );
});