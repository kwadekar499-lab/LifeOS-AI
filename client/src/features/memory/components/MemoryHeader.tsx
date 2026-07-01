import { memo } from "react";
import { MEMORY_COPY } from "../constants/copy";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type MemoryHeaderProps = WithClassName & {
  title?: string;
  description?: string;
};

export const MemoryHeader = memo(function MemoryHeader({
  title = MEMORY_COPY.title,
  description = MEMORY_COPY.description,
  className,
}: MemoryHeaderProps) {
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
