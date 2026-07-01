import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskCard } from "./TaskCard";
import { TasksEmptyState } from "./TasksEmptyState";
import type { Task } from "../types";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";
import { useTaskNavigation } from "../hooks/useTaskNavigation";

type TasksListProps = WithClassName & {
  tasks: Task[];
  viewMode?: "board" | "list";
  onTaskSelect?: (id: string) => void;
  onTaskDelete?: (id: string) => void;
  onTaskToggleStatus?: (id: string) => void;
  onCreateTask?: () => void;
};

export const TasksList = memo(function TasksList({
  tasks,
  viewMode = "list",
  onTaskSelect,
  onTaskDelete,
  onTaskToggleStatus,
  onCreateTask,
  className,
}: TasksListProps) {
  const {
    handleKeyDown,
    handleMouseEnter,
    handleMouseLeave,
    registerCard,
    isHighlighted,
    isHovered,
  } = useTaskNavigation({ tasks });

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={className}
      >
        <TasksEmptyState onAction={onCreateTask} />
      </motion.div>
    );
  }

  const isBoardView = viewMode === "board";

  return (
    <div
      className={cn(
        isBoardView
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          : "flex flex-col gap-2",
        className,
      )}
      role="list"
      aria-label="Tasks list"
      onKeyDown={handleKeyDown}
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="listitem"
            className={cn(
              "rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 ring-1 ring-white/[0.04] transition-all hover:border-white/[0.1] hover:bg-white/[0.04] hover:ring-white/[0.08]",
              isBoardView && "w-full",
            )}
          >
            <TaskCard
              task={task}
              onSelect={onTaskSelect}
              onDelete={onTaskDelete}
              onToggleStatus={onTaskToggleStatus}
              isHighlighted={isHighlighted(task.id)}
              isHovered={isHovered(task.id)}
              onMouseEnter={() => handleMouseEnter(task.id)}
              onMouseLeave={handleMouseLeave}
              registerRef={registerCard(task.id)}
              className="flex flex-col items-start gap-4 sm:!flex-row sm:!items-center !rounded-none !bg-transparent !p-0 !ring-0 hover:!bg-transparent"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});