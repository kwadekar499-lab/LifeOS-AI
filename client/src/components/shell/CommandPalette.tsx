import { memo, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Command, Search } from "lucide-react";
import { useEscapeKey } from "@/hooks/useKeyboardShortcut";
import { useShellStore } from "@/store/shellStore";

export const CommandPalette = memo(function CommandPalette() {
  const commandPaletteOpen = useShellStore((state) => state.commandPaletteOpen);
  const closeCommandPalette = useShellStore((state) => state.closeCommandPalette);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    closeCommandPalette();
  }, [closeCommandPalette]);

  useEscapeKey(handleClose, commandPaletteOpen);

  useEffect(() => {
    if (!commandPaletteOpen) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [commandPaletteOpen]);

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
            onClick={handleClose}
            aria-label="Close command palette"
          />

          <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center px-4 pt-[min(20vh,120px)]">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="command-palette-title"
              className="pointer-events-auto w-full max-w-lg overflow-hidden rounded-xl border border-white/[0.08] bg-[#12121A] shadow-2xl shadow-black/50"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            >
              <h2 id="command-palette-title" className="sr-only">
                Command palette
              </h2>

              <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
                <Search
                  className="size-4 shrink-0 text-white/30"
                  aria-hidden="true"
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search commands…"
                  className="focus-ring w-full bg-transparent text-sm text-white placeholder:text-white/30"
                  aria-label="Search commands"
                  readOnly
                />
              </div>

              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06]">
                  <Command className="size-4 text-white/30" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-white/60">
                  No commands yet
                </p>
                <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-white/30">
                  Commands will appear here as features are added to LifeOS.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
});
