import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type TasksProgressProps = WithClassName & {
  completed: number;
  total: number;
};

const SIZE = 100;
const STROKE_WIDTH = 6;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const TasksProgress = memo(function TasksProgress({
  completed,
  total,
  className,
}: TasksProgressProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div
      className={cn(
        "flex items-center gap-5 rounded-xl bg-white/[0.03] px-5 py-4 ring-1 ring-white/[0.06]",
        className,
      )}
      role="region"
      aria-label={`Progress: ${percentage}% complete, ${completed} of ${total} tasks`}
    >
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          className="-rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            className="text-white/[0.06]"
          />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            className="text-emerald-400"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{
              strokeDashoffset:
                CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-sm font-semibold text-white tabular-nums"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
          >
            {percentage}%
          </motion.span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white/80">Progress</span>
        <span className="text-xs text-white/40 tabular-nums">
          <span className="text-emerald-400">{completed}</span>
          {" / "}
          <span>{total}</span>
          {" completed"}
        </span>
      </div>
    </div>
  );
});