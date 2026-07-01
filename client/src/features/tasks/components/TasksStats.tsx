import { memo } from "react";
import { motion } from "framer-motion";
import {
  ListTodo,
  CheckCircle2,
  Timer,
  AlertTriangle,
  CalendarX,
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type TasksStatsProps = WithClassName & {
  total: number;
  completed: number;
  inProgress: number;
  highPriority: number;
  overdue: number;
};

type StatCardConfig = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  glow: string;
};

type StatCardProps = Omit<StatCardConfig, "key"> & {
  value: number;
};

function AnimatedNumber({ value: target }: { value: number }) {
  return (
    <span className="tabular-nums">
      {target}
    </span>
  );
}

const statCards: StatCardConfig[] = [
  {
    key: "total",
    label: "Total Tasks",
    icon: ListTodo,
    color: "text-blue-400",
    glow: "bg-blue-500/[0.08]",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CheckCircle2,
    color: "text-emerald-400",
    glow: "bg-emerald-500/[0.08]",
  },
  {
    key: "inProgress",
    label: "In Progress",
    icon: Timer,
    color: "text-sky-400",
    glow: "bg-sky-500/[0.08]",
  },
  {
    key: "highPriority",
    label: "High Priority",
    icon: AlertTriangle,
    color: "text-red-400",
    glow: "bg-red-500/[0.08]",
  },
  {
    key: "overdue",
    label: "Overdue",
    icon: CalendarX,
    color: "text-rose-400",
    glow: "bg-rose-500/[0.08]",
  },
];

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  glow,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative flex flex-col gap-1.5 rounded-xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06] transition-all duration-300 hover:bg-white/[0.05] hover:ring-white/[0.1]"
    >
      <div className={cn("absolute inset-0 rounded-xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100", glow)} />
      <div className="relative z-10 flex items-center gap-3">
        <div className={cn("flex size-9 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06]", color)}>
          <Icon className="size-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-white/40">{label}</span>
          <span className={cn("text-xl font-semibold tracking-tight", color)}>
            <AnimatedNumber value={value} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export const TasksStats = memo(function TasksStats({
  total,
  completed,
  inProgress,
  highPriority,
  overdue,
  className,
}: TasksStatsProps) {
  const values = { total, completed, inProgress, highPriority, overdue };

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5",
        className,
      )}
      role="region"
      aria-label="Task statistics"
    >
      {statCards.map((card) => {
        const val = values[card.key as keyof typeof values];
        return (
          <div key={card.key}>
            <StatCard
              label={card.label}
              icon={card.icon}
              color={card.color}
              glow={card.glow}
              value={val}
            />
          </div>
        );
      })}
    </div>
  );
});