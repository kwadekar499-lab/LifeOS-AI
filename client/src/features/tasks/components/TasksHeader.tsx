import { memo } from "react";
import { TASKS_COPY } from "../constants/copy";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type TasksHeaderProps = WithClassName & {
  title?: string;
  description?: string;
};

export const TasksHeader = memo(function TasksHeader({
  title = TASKS_COPY.title,
  description = TASKS_COPY.description,
  className,
}: TasksHeaderProps) {
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
