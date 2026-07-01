import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEscapeKey, useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useShellStore } from "@/stores/shellStore";
import { useCommandPalette } from "@/features/command/hooks/useCommandPalette";

import { CommandInput } from "./CommandInput";
import { CommandList } from "./CommandList";

export const CommandPalette = React.memo(function CommandPalette() {
  const commandPaletteOpen = useShellStore((state) => state.commandPaletteOpen);
  const closeCommandPalette = useShellStore((state) => state.closeCommandPalette);
  const palette = useCommandPalette();

  const handleClose = useCallback(() => {
    closeCommandPalette();
    palette.close();
  }, [closeCommandPalette, palette]);

  useEscapeKey(handleClose, commandPaletteOpen);
  useKeyboardShortcut("k", handleClose, { enabled: commandPaletteOpen });

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        handleClose();
      }
    },
    [handleClose],
  );

  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (commandPaletteOpen) {
      if (!hasOpenedRef.current) {
        hasOpenedRef.current = true;
        palette.open();
      }
      // Auto-focus the input when the palette opens
      const timer = setTimeout(() => {
        palette.inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      hasOpenedRef.current = false;
    }
  }, [commandPaletteOpen, palette]);

  const effectivePalette = useMemo(
    () => ({
      ...palette,
    }),
    [palette],
  );

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleBackdropClick}
            aria-label="Close command palette"
          />

          <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[min(20vh,120px)]">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="command-palette-title"
              className="w-full max-w-lg overflow-hidden rounded-xl border border-white/[0.08] bg-[#12121A]/95 shadow-2xl shadow-black/50 backdrop-blur-xl"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            >
              <h2 id="command-palette-title" className="sr-only">
                Command palette
              </h2>

              <CommandInput palette={effectivePalette} />
              <CommandList palette={effectivePalette} />

              <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2 text-xs text-white/40">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">↵</kbd>
                    Select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">ESC</kbd>
                  Close
                </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
});