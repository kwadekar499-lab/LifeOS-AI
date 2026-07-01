import { memo } from "react";
import { ASSISTANT_COPY } from "../constants/copy";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type AssistantHeaderProps = WithClassName & {
  title?: string;
};

export const AssistantHeader = memo(function AssistantHeader({
  title = ASSISTANT_COPY.title,
  className,
}: AssistantHeaderProps) {
  return (
    <header className={cn("shrink-0", className)}>
      <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
        {title}
      </h1>
    </header>
  );
});
