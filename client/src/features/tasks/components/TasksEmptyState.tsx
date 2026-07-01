import { memo } from "react";
import { ClipboardList, SearchX, PartyPopper, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { TASKS_COPY } from "../constants/copy";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

export type EmptyStateVariant = "no-tasks" | "no-results" | "all-completed";

type TasksEmptyStateProps = WithClassName & {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

const VARIANT_ICONS: Record<EmptyStateVariant, typeof ClipboardList> = {
  "no-tasks": ClipboardList,
  "no-results": SearchX,
  "all-completed": PartyPopper,
};

const VARIANT_COLORS: Record<EmptyStateVariant, string> = {
  "no-tasks": "bg-blue-500/[0.05]",
  "no-results": "bg-amber-500/[0.05]",
  "all-completed": "bg-emerald-500/[0.05]",
};

function TasksIllustration({ variant }: { variant: EmptyStateVariant }) {
  const Icon = VARIANT_ICONS[variant];
  const glowColor = VARIANT_COLORS[variant];

  return (
    <motion.div
      className="relative mx-auto mb-8 size-36"
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={cn("absolute inset-0 rounded-full blur-2xl", glowColor)} />
      <div className="absolute inset-4 rounded-full blur-xl" />

      <motion.div
        className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.1]"
        animate={
          variant === "all-completed"
            ? { rotate: [0, 5, 0, -5, 0], scale: [1, 1.05, 1] }
            : { y: [0, -4, 0] }
        }
        transition={{
          duration: variant === "all-completed" ? 2 : 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Icon className="size-6 text-white/35" />
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute left-4 top-8 h-2 w-16 rounded-full bg-white/20 -rotate-12"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute right-6 top-10 h-2 w-12 rounded-full bg-white/15 rotate-6"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-8 left-10 h-2 w-14 rounded-full bg-white/10 -rotate-6"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity, delay: 1 }}
      />
    </motion.div>
  );
}

export const TasksEmptyState = memo(function TasksEmptyState({
  variant = "no-tasks",
  title,
  description,
  actionLabel,
  onAction,
  className,
}: TasksEmptyStateProps) {
  const resolvedTitle =
    title ??
    (variant === "no-tasks"
      ? TASKS_COPY.emptyState.title
      : variant === "no-results"
        ? TASKS_COPY.emptySearch.title
        : TASKS_COPY.emptyCompleted.title);

  const resolvedDescription =
    description ??
    (variant === "no-tasks"
      ? TASKS_COPY.emptyState.description
      : variant === "no-results"
        ? TASKS_COPY.emptySearch.description
        : TASKS_COPY.emptyCompleted.description);

  const resolvedActionLabel =
    actionLabel ??
    (variant === "all-completed"
      ? TASKS_COPY.emptyCompleted.action
      : TASKS_COPY.emptyState.action);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center px-4 py-12 text-center",
        className,
      )}
    >
      <TasksIllustration variant={variant} />

      <h2 className="text-lg font-semibold tracking-tight text-white">
        {resolvedTitle}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-white/40">
        {resolvedDescription}
      </p>

      {onAction && (
        <motion.button
          type="button"
          onClick={onAction}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-5 py-2.5 text-sm font-medium text-white/80 ring-1 ring-white/[0.1] transition-colors hover:bg-white/[0.12] hover:text-white"
          aria-label={resolvedActionLabel}
        >
          <Plus className="size-4" aria-hidden="true" />
          {resolvedActionLabel}
        </motion.button>
      )}
    </motion.div>
  );
});