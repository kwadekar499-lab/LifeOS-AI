import { memo, useState, useRef, useEffect, useCallback } from "react";
import {
  Brain,
  ChevronDown,
  Library,
  RotateCcw,
  Settings,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ASSISTANT_COPY } from "../constants/copy";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type AssistantToolbarProps = WithClassName & {
  memoryEnabled?: boolean;
  knowledgeEnabled?: boolean;
  onMemoryNavigate?: () => void;
  onKnowledgeNavigate?: () => void;
  onSettingsNavigate?: () => void;
  onClearConversation?: () => void;
};

export const AssistantToolbar = memo(function AssistantToolbar({
  memoryEnabled = true,
  knowledgeEnabled = true,
  onMemoryNavigate,
  onKnowledgeNavigate,
  onSettingsNavigate,
  onClearConversation,
  className,
}: AssistantToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-b border-white/[0.06] pb-2",
        className,
      )}
      role="toolbar"
      aria-label="Assistant controls"
    >
      <ContextSelector />

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onMemoryNavigate}
          className={cn(
            "focus-ring inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm font-medium ring-1 transition-colors",
            memoryEnabled
              ? "bg-violet-500/10 text-violet-200/80 ring-violet-500/20"
              : "bg-white/[0.04] text-white/45 ring-white/[0.06] hover:text-white/70",
          )}
          aria-label={ASSISTANT_COPY.memoryToggleLabel}
          aria-pressed={memoryEnabled}
        >
          <Brain className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">
            {ASSISTANT_COPY.memoryToggleLabel}
          </span>
        </button>

        <button
          type="button"
          onClick={onKnowledgeNavigate}
          className={cn(
            "focus-ring inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm font-medium ring-1 transition-colors",
            knowledgeEnabled
              ? "bg-indigo-500/10 text-indigo-200/80 ring-indigo-500/20"
              : "bg-white/[0.04] text-white/45 ring-white/[0.06] hover:text-white/70",
          )}
          aria-label={ASSISTANT_COPY.knowledgeToggleLabel}
          aria-pressed={knowledgeEnabled}
        >
          <Library className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">
            {ASSISTANT_COPY.knowledgeToggleLabel}
          </span>
        </button>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={onClearConversation}
          className="focus-ring inline-flex items-center gap-1 rounded-xl bg-white/[0.04] px-2.5 py-1.5 text-xs sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm text-white/45 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.06] hover:text-white/70"
          aria-label={ASSISTANT_COPY.clearConversationLabel}
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          <span className="hidden md:inline">
            {ASSISTANT_COPY.clearConversationLabel}
          </span>
        </button>

        <button
          type="button"
          onClick={onSettingsNavigate}
          className="focus-ring rounded-xl bg-white/[0.04] p-1.5 sm:p-2 text-white/45 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.06] hover:text-white/70"
          aria-label={ASSISTANT_COPY.settingsLabel}
        >
          <Settings className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
});

function ContextSelector() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  const sources = [
    { value: "all", label: "All Sources", comingSoon: false },
    { value: "memory", label: "Memory", comingSoon: true },
    { value: "knowledge", label: "Knowledge", comingSoon: true },
    { value: "tasks", label: "Tasks", comingSoon: true },
    { value: "journal", label: "Journal", comingSoon: true },
    { value: "files", label: "Files", comingSoon: true },
  ];

  return (
    <div ref={ref} className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        whileTap={{ scale: 0.97 }}
        className="focus-ring inline-flex items-center gap-1.5 rounded-xl bg-white/[0.04] px-2.5 py-1.5 text-xs sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm font-medium text-white/60 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.06] hover:text-white/80"
        aria-label={ASSISTANT_COPY.contextSelectorLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">
          {ASSISTANT_COPY.contextSelectorPlaceholder}
        </span>
        <ChevronDown className="size-3.5 text-white/30" aria-hidden="true" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full z-20 mt-1.5 min-w-[200px] overflow-hidden rounded-xl border border-white/[0.06] bg-[#0D0D14] shadow-2xl"
            role="listbox"
            aria-label={ASSISTANT_COPY.contextSelectorLabel}
          >
            {sources.map((source) => (
              <button
                key={source.value}
                type="button"
                role="option"
                aria-selected={source.value === "all"}
                disabled={source.comingSoon}
                className={cn(
                  "focus-ring flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors",
                  source.comingSoon
                    ? "cursor-not-allowed text-white/30"
                    : "hover:bg-white/[0.04] text-white/80 hover:text-white",
                )}
              >
                <span className="flex-1">{source.label}</span>
                {source.comingSoon && (
                  <span className="text-[10px] font-medium uppercase tracking-wider text-white/20">
                    Soon
                  </span>
                )}
                {!source.comingSoon && source.value === "all" && (
                  <Check className="size-3.5 shrink-0" aria-hidden="true" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
