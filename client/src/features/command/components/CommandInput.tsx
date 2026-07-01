import React, { useCallback } from "react";
import { Search } from "lucide-react";
import type { UseCommandPaletteReturn } from "../hooks/useCommandPalette";

interface CommandInputProps {
  palette: UseCommandPaletteReturn;
}

export const CommandInput = React.memo(function CommandInput({ palette }: CommandInputProps) {
  const { state, setQuery, inputRef } = palette;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    },
    [setQuery],
  );

  return (
    <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
      <Search className="size-4 shrink-0 text-white/30" aria-hidden="true" />
      <input
        ref={inputRef}
        type="text"
        value={state.searchQuery}
        onChange={handleChange}
        placeholder="Search commands…"
        className="focus-ring w-full bg-transparent text-sm text-white placeholder:text-white/30"
        aria-label="Search commands"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      {state.searchQuery && (
        <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-xs text-white/40">
          ESC
        </kbd>
      )}
    </div>
  );
});