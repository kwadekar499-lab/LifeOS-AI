import { useEffect, useRef, useCallback, useMemo } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchStore } from "../store/search-store";
import type { SearchItem } from "../types/search";

function useDebounce<T extends (...args: string[]) => void>(
  callback: T,
  delay: number,
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  ) as T;
}

function groupResultsByModule(results: SearchItem[]): Map<string, SearchItem[]> {
  const grouped = new Map<string, SearchItem[]>();
  results.forEach((item) => {
    const existing = grouped.get(item.module) || [];
    existing.push(item);
    grouped.set(item.module, existing);
  });
  return grouped;
}

function GlobalSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const isOpen = useSearchStore((state) => state.isOpen);
  const query = useSearchStore((state) => state.query);
  const results = useSearchStore((state) => state.results);
  const selectedIndex = useSearchStore((state) => state.selectedIndex);
  const setQuery = useSearchStore((state) => state.setQuery);
  const closeSearch = useSearchStore((state) => state.closeSearch);
  const setSelectedIndex = useSearchStore((state) => state.setSelectedIndex);
  const selectItem = useSearchStore((state) => state.selectItem);

  const debouncedSetQuery = useDebounce(setQuery, 150);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Trap focus inside overlay
  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = overlayRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeSearch();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const maxIndex = results.length - 1;
        setSelectedIndex(selectedIndex < maxIndex ? selectedIndex + 1 : 0);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const maxIndex = results.length - 1;
        setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : maxIndex);
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (results[selectedIndex]) {
          selectItem(results[selectedIndex]);
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, results, setSelectedIndex, selectItem, closeSearch]);

  // Scroll selected item into view
  useEffect(() => {
    if (!isOpen || selectedIndex < 0 || !resultsRef.current) return;

    const selectedElement = resultsRef.current.querySelector(
      `[data-index="${selectedIndex}"]`,
    );
    selectedElement?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIndex, isOpen]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) {
        closeSearch();
      }
    },
    [closeSearch],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSetQuery(e.target.value);
    },
    [debouncedSetQuery],
  );

  const groupedResults = useMemo(() => groupResultsByModule(results), [results]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-[15vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Global Search"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#14141A] shadow-2xl"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Search className="size-5 shrink-0 text-white/40" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search LifeOS AI..."
                className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={closeSearch}
                className="focus-ring rounded-md p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white/60"
                aria-label="Close search"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* Results */}
            <div
              ref={resultsRef}
              className="max-h-[60vh] overflow-y-auto p-2"
              role="listbox"
              aria-label="Search results"
            >
              {results.length === 0 ? (
                <div className="py-12 text-center text-white/40">
                  {query.trim() ? "No matching results." : "Start typing to search..."}
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from(groupedResults.entries()).map(([module, items]) => (
                    <div key={module}>
                      <div className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-white/40">
                        {module}
                      </div>
                      <div className="space-y-1">
                        {items.map((item) => {
                          const globalIndex = results.findIndex(
                            (r) => r.id === item.id,
                          );
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <button
                              key={item.id}
                              type="button"
                              data-index={globalIndex}
                              onClick={() => selectItem(item)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={`focus-ring w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                                isSelected
                                  ? "bg-white/10 text-white"
                                  : "text-white/70 hover:bg-white/5"
                              }`}
                              role="option"
                              aria-selected={isSelected}
                            >
                              <div className="flex items-start gap-3">
                                {item.icon && (
                                  <span className="mt-0.5 shrink-0 text-lg">
                                    {item.icon}
                                  </span>
                                )}
                                <div className="min-w-0 flex-1">
                                  <div className="font-medium">{item.title}</div>
                                  {item.description && (
                                    <div className="mt-0.5 truncate text-sm text-white/50">
                                      {item.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {results.length > 0 && (
              <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-xs text-white/40">
                <div className="flex items-center gap-3">
                  <span>
                    <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono">↑↓</kbd> to
                    navigate
                  </span>
                  <span>
                    <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono">↵</kbd> to
                    select
                  </span>
                </div>
                <span>
                  <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono">esc</kbd> to
                  close
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { GlobalSearch };
export default GlobalSearch;