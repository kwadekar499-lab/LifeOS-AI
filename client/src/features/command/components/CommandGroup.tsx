import React from "react";
import type { CommandItem as CommandItemType } from "../types/command";
import type { UseCommandPaletteReturn } from "../hooks/useCommandPalette";
import { CommandItemComponent } from "./CommandItem";

interface CommandGroupProps {
  label: string;
  items: CommandItemType[];
  palette: UseCommandPaletteReturn;
  startIndex: number;
}

export const CommandGroupComponent = React.memo(function CommandGroupComponent({
  label,
  items,
  palette,
  startIndex,
}: CommandGroupProps) {
  return (
    <div role="group" aria-label={label} className="px-2 py-1.5">
      <div className="px-2 pb-1.5 pt-2 text-xs font-medium uppercase tracking-wider text-white/40">
        {label}
      </div>
      <div className="flex flex-col gap-0.5">
        {items.map((item, index) => (
          <CommandItemComponent
            key={item.id}
            item={item}
            index={index}
            palette={palette}
            globalIndex={startIndex + index}
          />
        ))}
      </div>
    </div>
  );
});