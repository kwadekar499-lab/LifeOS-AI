import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskCard } from "./TaskCard";
import { TasksEmptyState } from "./TasksEmptyState";
import type { Task } from "../types";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";
import { useTaskNavigation } from "../hooks/useTaskNavigation";

type TasksBoardProps = WithClassName & {
  tasks: Task[];
  onTaskSelect?: (id: string) => void;
  onTaskDelete?: (id: string) => void;
  onTaskToggleStatus?: (id: string) => void;
  onCreateTask?: () => void;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export const TasksBoard = memo(function TasksBoard({
  tasks,
  onTaskSelect,
  onTaskDelete,
  onTaskToggleStatus,
  onCreateTask,
  className,
}: TasksBoardProps) {
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
      role="list"
      aria-label="Tasks"
      onKeyDown={handleKeyDown}
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            role="listitem"
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
              boardView
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
});