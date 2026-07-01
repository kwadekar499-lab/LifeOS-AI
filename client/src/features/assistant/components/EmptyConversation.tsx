import { memo } from "react";
import { Sparkles } from "lucide-react";
import { ASSISTANT_COPY } from "../constants/copy";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type EmptyConversationProps = WithClassName & {
  title?: string;
  description?: string;
};

function IntelligenceIllustration() {
  return (
    <div className="relative mx-auto mb-8 size-36" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-violet-500/[0.05] blur-2xl" />
      <div className="absolute inset-4 rounded-full bg-indigo-500/[0.04] blur-xl" />

      <div className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.1]">
        <Sparkles className="size-6 text-white/35" />
      </div>

      <div className="absolute left-3 top-6 size-2 rounded-full bg-white/20" />
      <div className="absolute right-4 top-8 size-1.5 rounded-full bg-white/15" />
      <div className="absolute bottom-6 left-6 size-2.5 rounded-full bg-white/10" />
      <div className="absolute bottom-8 right-5 size-2 rounded-full bg-white/15" />

      <div className="absolute left-8 top-10 h-px w-10 rotate-45 bg-gradient-to-r from-white/15 to-transparent" />
      <div className="absolute right-7 top-12 h-px w-8 -rotate-45 bg-gradient-to-r from-white/10 to-transparent" />
      <div className="absolute bottom-10 left-10 h-px w-12 -rotate-12 bg-gradient-to-r from-white/10 to-transparent" />
    </div>
  );
}

export const EmptyConversation = memo(function EmptyConversation({
  title = ASSISTANT_COPY.emptyState.title,
  description = ASSISTANT_COPY.emptyState.description,
  className,
}: EmptyConversationProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-12 text-center",
        className,
      )}
    >
      <IntelligenceIllustration />

      <h2 className="text-lg font-semibold tracking-tight text-white">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-white/40">
        {description}
      </p>
    </div>
  );
});
