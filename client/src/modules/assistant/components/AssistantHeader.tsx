import { memo } from "react";
import { ASSISTANT_COPY } from "../constants/copy";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type AssistantHeaderProps = WithClassName & {
  title?: string;
  description?: string;
};

export const AssistantHeader = memo(function AssistantHeader({
  title = ASSISTANT_COPY.title,
  description = ASSISTANT_COPY.description,
  className,
}: AssistantHeaderProps) {
  return (
    <header className={cn("shrink-0", className)}>
      <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/45 sm:text-[15px]">
        {description}
      </p>
    </header>
  );
});
