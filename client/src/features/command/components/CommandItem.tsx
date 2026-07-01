import React, { useCallback, useMemo } from "react";
import { Star } from "lucide-react";
import type { CommandItem as CommandItemType } from "../types/command";
import type { UseCommandPaletteReturn } from "../hooks/useCommandPalette";
import { getMatchIndices, highlightText } from "../utils/fuzzySearch";

interface CommandItemProps {
  item: CommandItemType;
  index: number;
  palette: UseCommandPaletteReturn;
  globalIndex: number;
}

export const CommandItemComponent = React.memo(function CommandItemComponent({
  item,
  palette,
  globalIndex,
}: CommandItemProps) {
  const { state, executeCommand, toggleFavorite, favoriteIds } = palette;
  const isSelected = state.selectedIndex === globalIndex;
  const isFavorite = favoriteIds.includes(item.id);

  const matchIndices = useMemo(
    () => getMatchIndices(state.searchQuery, item.label),
    [state.searchQuery, item.label],
  );

  const handleClick = useCallback(() => {
    executeCommand(item);
  }, [executeCommand, item]);

  const handleToggleFavorite = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      toggleFavorite(item.id);
    },
    [toggleFavorite, item.id],
  );

  const handleMouseEnter = useCallback(() => {
    palette.setSelectedIndex(globalIndex);
  }, [palette, globalIndex]);

  return (
    <div
      role="option"
      aria-selected={isSelected}
      data-selected={isSelected}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={[
        "flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors",
        isSelected ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
      ].join(" ")}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/5 ring-1 ring-white/10">
        {item.icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {highlightText(item.label, matchIndices)}
        </span>
        {item.description && (
          <span className="block truncate text-xs text-white/40">{item.description}</span>
        )}
      </span>

      <button
        type="button"
        onClick={handleToggleFavorite}
        className="flex size-7 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-white/10"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Star
          className={`size-3.5 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white/30"}`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
});