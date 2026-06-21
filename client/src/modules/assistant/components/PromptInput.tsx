import { memo } from "react";
import { ArrowUp, Mic, Paperclip } from "lucide-react";
import { ASSISTANT_COPY } from "../constants/copy";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type PromptInputProps = WithClassName & {
  placeholder?: string;
  disabled?: boolean;
};

export const PromptInput = memo(function PromptInput({
  placeholder = ASSISTANT_COPY.promptPlaceholder,
  disabled = true,
  className,
}: PromptInputProps) {
  return (
    <div
      className={cn("shrink-0 pt-4", className)}
      role="form"
      aria-label="Message input"
    >
      <div className="rounded-2xl bg-white/[0.04] p-2 ring-1 ring-white/[0.08] transition-colors focus-within:ring-white/[0.12]">
        <textarea
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          rows={3}
          aria-label="Message to LifeOS"
          className="focus-ring block w-full resize-none bg-transparent px-3 py-2 text-sm leading-relaxed text-white placeholder:text-white/30 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <div className="flex items-center justify-between gap-2 px-2 pb-1 pt-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="focus-ring rounded-lg p-2 text-white/30 transition-colors hover:text-white/50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={ASSISTANT_COPY.attachLabel}
            >
              <Paperclip className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled
              className="focus-ring rounded-lg p-2 text-white/30 transition-colors hover:text-white/50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={ASSISTANT_COPY.voiceLabel}
            >
              <Mic className="size-4" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            disabled
            className="focus-ring flex size-8 items-center justify-center rounded-full bg-white/10 text-white/30 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={ASSISTANT_COPY.sendLabel}
          >
            <ArrowUp className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] text-white/20">
        LifeOS reasons across your connected context. Responses will stream here.
      </p>
    </div>
  );
});
