import { memo, type KeyboardEvent } from "react";
import {
  CalendarDays,
  FolderOpen,
  Trash2,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Task } from "../types";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type TaskCardProps = WithClassName & {
  task: Task;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  isHighlighted?: boolean;
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  registerRef?: (el: HTMLElement | null) => void;
  boardView?: boolean;
};

const PRIORITY_STYLES: Record<string, string> = {
  high: "border-red-500/30 bg-red-500/10 text-red-400",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
};

const STATUS_STYLES: Record<string, string> = {
  "in-progress": "border-sky-500/30 bg-sky-500/10 text-sky-400",
  done: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  blocked: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  todo: "border-white/10 bg-white/[0.04] text-white/45",
};

function formatPriorityLabel(priority: string): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function formatStatusLabel(status: string): string {
  switch (status) {
    case "in-progress":
      return "In Progress";
    case "done":
      return "Done";
    case "blocked":
      return "Blocked";
    default:
      return "To Do";
  }
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export const TaskCard = memo(function TaskCard({
  task,
  onSelect,
  onDelete,
  onToggleStatus,
  isHighlighted = false,
  isHovered = false,
  onMouseEnter,
  onMouseLeave,
  registerRef,
  boardView = false,
  className,
}: TaskCardProps) {
  const handleClick = (): void => {
    onSelect?.(task.id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(task.id);
    }
  };

  const handleMouseEnterCard = (): void => {
    onMouseEnter?.();
  };

  const handleMouseLeaveCard = (): void => {
    onMouseLeave?.();
  };

  const handleDelete = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onDelete?.(task.id);
  };

  const handleToggle = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onToggleStatus?.(task.id);
  };

  const isDone = task.status === "done";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnterCard}
      onMouseLeave={handleMouseLeaveCard}
      aria-label={`Task: ${task.title}`}
      className={cn(
        "group flex min-w-0 cursor-pointer flex-col rounded-xl bg-white/[0.03] p-5 ring-1 ring-white/[0.06] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/[0.06] hover:ring-white/[0.12] hover:shadow-lg hover:shadow-white/[0.02] focus-visible:outline-2 focus-visible:outline-white/50 focus-visible:outline-offset-2",
        (isHighlighted || isHovered) && "bg-white/[0.06] ring-white/[0.12]",
        isDone && "opacity-60",
        className,
      )}
      ref={registerRef}
    >
      {/* Badges and Actions - Mobile: vertical stack, Desktop: horizontal row */}
      <div className={cn("mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2", !boardView && "sm:mb-0")}>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider transition-colors",
              PRIORITY_STYLES[task.priority],
            )}
            aria-label={`Priority: ${task.priority}`}
          >
            {formatPriorityLabel(task.priority)}
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider transition-colors",
              STATUS_STYLES[task.status],
            )}
            aria-label={`Status: ${formatStatusLabel(task.status)}`}
          >
            {formatStatusLabel(task.status)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:ml-0">
          <button
            type="button"
            onClick={handleToggle}
            className="focus-ring inline-flex size-7 items-center justify-center rounded-lg text-white/70 transition-all hover:text-white hover:bg-white/10"
            aria-label={isDone ? "Mark as incomplete" : "Mark as complete"}
          >
            {isDone ? (
              <CheckCircle2 className="size-4 text-emerald-400" aria-hidden="true" />
            ) : (
              <Circle className="size-4" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="focus-ring inline-flex size-7 items-center justify-center rounded-lg text-white/70 transition-all hover:bg-red-500/20 hover:text-red-400"
            aria-label={`Delete task: ${task.title}`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Title - Mobile: 2 lines, Desktop: 1 line */}
      <h3
        className={cn(
          "min-w-0 text-sm font-semibold leading-snug text-white/90 transition-colors duration-200 group-hover:text-white line-clamp-2 sm:line-clamp-1",
          isDone && "line-through text-white/50",
        )}
      >
        {task.title}
      </h3>

      {/* Description - Mobile: 2 lines, Desktop: 1 line */}
      {task.description && (
        <p className="mt-2 min-w-0 text-[13px] leading-relaxed text-white/40 line-clamp-2 sm:line-clamp-1">
          {task.description}
        </p>
      )}

      {/* Labels - Mobile: single line truncate, Desktop: wrap */}
      {task.labels.length > 0 && (
        <div className={cn("mb-4 mt-3 flex flex-nowrap items-center gap-1.5 overflow-hidden sm:flex-wrap", !boardView && "sm:mb-0 sm:mt-0")}>
          {task.labels.slice(0, 4).map((label) => (
            <span
              key={label.id}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white/40 ring-1 ring-white/[0.06] transition-colors group-hover:text-white/50 group-hover:ring-white/[0.1] truncate"
            >
              <span
                className="size-1.5 rounded-full shrink-0"
                style={{ backgroundColor: label.color || "currentColor" }}
                aria-hidden="true"
              />
              <span className="truncate">{label.name}</span>
            </span>
          ))}
        </div>
      )}

      {/* Footer - Mobile: vertical stack, Desktop: horizontal row */}
      <div className={cn("flex flex-col gap-1.5 border-t border-white/[0.04] pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2", !boardView && "sm:border-t-0 sm:pt-0")}>
        {/* Project */}
        {task.project && (
          <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-white/30 transition-colors group-hover:text-white/40 truncate">
            <FolderOpen className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{task.project.name}</span>
          </span>
        )}

        {/* Due date */}
        {task.dueDate && (
          <span
            className="inline-flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-white/30 transition-colors group-hover:text-white/40 truncate"
            aria-label={`Due: ${formatDate(task.dueDate)}`}
          >
            <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{formatDate(task.dueDate)}</span>
          </span>
        )}
      </div>
    </motion.article>
  );
});