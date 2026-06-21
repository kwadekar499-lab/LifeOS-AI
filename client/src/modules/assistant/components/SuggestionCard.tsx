import { memo } from "react";
import type { AssistantSuggestion } from "../types";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type SuggestionCardProps = WithClassName & {
  suggestion: AssistantSuggestion;
  onSelect?: (suggestion: AssistantSuggestion) => void;
};

export const SuggestionCard = memo(function SuggestionCard({
  suggestion,
  onSelect,
  className,
}: SuggestionCardProps) {
  const handleClick = (): void => {
    onSelect?.(suggestion);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "focus-ring rounded-xl bg-white/[0.03] p-4 text-left ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.05] hover:ring-white/[0.1]",
        className,
      )}
      aria-label={suggestion.label}
    >
      <span className="text-sm font-medium text-white/80">
        {suggestion.label}
      </span>
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/35">
        {suggestion.prompt}
      </p>
    </button>
  );
});
