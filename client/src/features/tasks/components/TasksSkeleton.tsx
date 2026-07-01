import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type TasksSkeletonProps = WithClassName & {
  count?: number;
  viewMode?: "board" | "list";
};

function SkeletonPulse({ className }: { className: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/[0.03]",
        className,
      )}
    />
  );
}

function BoardSkeletonCard() {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white/[0.02] p-5 ring-1 ring-white/[0.04]">
      {/* Badges row */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <SkeletonPulse className="h-5 w-16 rounded-md" />
          <SkeletonPulse className="h-5 w-20 rounded-md" />
        </div>
        <SkeletonPulse className="h-5 w-5 rounded-md" />
      </div>

      {/* Title lines */}
      <div className="flex flex-col gap-2">
        <SkeletonPulse className="h-4 w-3/4" />
        <SkeletonPulse className="h-4 w-1/2" />
      </div>

      {/* Label pills */}
      <div className="flex gap-1.5">
        <SkeletonPulse className="h-5 w-14 rounded-full" />
        <SkeletonPulse className="h-5 w-16 rounded-full" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.04] pt-3.5">
        <SkeletonPulse className="h-3.5 w-24" />
        <SkeletonPulse className="h-3.5 w-20" />
      </div>
    </div>
  );
}

function ListSkeletonRow() {
  return (
    <div className="flex items-center gap-4 border-b border-white/[0.04] px-4 py-4 last:border-b-0">
      <SkeletonPulse className="size-5 shrink-0 rounded-full" />
      <div className="flex flex-1 items-center gap-3">
        <SkeletonPulse className="h-4 w-1/3" />
        <SkeletonPulse className="h-5 w-14 rounded-md" />
        <SkeletonPulse className="h-5 w-16 rounded-md" />
      </div>
      <div className="flex items-center gap-3">
        <SkeletonPulse className="h-5 w-16 rounded-full" />
        <SkeletonPulse className="h-5 w-16 rounded-full" />
      </div>
      <SkeletonPulse className="h-3.5 w-20" />
      <SkeletonPulse className="size-6 rounded-md" />
    </div>
  );
}

export const TasksSkeleton = memo(function TasksSkeleton({
  count = 8,
  viewMode = "board",
  className,
}: TasksSkeletonProps) {
  return (
    <div
      className={cn(
        viewMode === "board"
          ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "flex flex-col",
        className,
      )}
      role="status"
      aria-label="Loading tasks"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.04, ease: "easeOut" }}
        >
          {viewMode === "board" ? (
            <BoardSkeletonCard />
          ) : (
            <ListSkeletonRow />
          )}
        </motion.div>
      ))}
    </div>
  );
});