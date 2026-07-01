import { memo } from "react";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type TypingIndicatorProps = WithClassName & {
  label?: string;
};

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50" />
    </span>
  );
}

export const TypingIndicator = memo(function TypingIndicator({
  label = "LifeOS is thinking",
  className,
}: TypingIndicatorProps) {
  return (
    <div
      className={cn(
        "flex w-full justify-start",
        className,
      )}
      aria-label={label}
      role="status"
      aria-live="polite"
    >
      <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white/[0.06] px-4 py-3 ring-1 ring-white/[0.08]">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-white/30">
          LifeOS
        </p>
        <div className="flex items-center gap-2">
          <TypingDots />
          <span className="text-xs text-white/40">{label}</span>
        </div>
      </div>
    </div>
  );
});