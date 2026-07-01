import { memo, useState, useCallback, useRef, useEffect } from "react";
import {
  ArrowDownUp,
  ClipboardList,
  Flag,
  Filter,
  LayoutGrid,
  List,
  Plus,
  Check,
  X,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TASKS_COPY } from "../constants/copy";
import { TASK_STATUSES, TASK_PRIORITIES } from "../types";
import type { TaskStatus, TaskPriority } from "../types";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

export type TaskViewMode = "board" | "list";

export type TaskSortOption =
  | "newest"
  | "oldest"
  | "dueDate"
  | "priority"
  | "alphabetical";

type TasksToolbarProps = WithClassName & {
  viewMode?: TaskViewMode;
  onViewModeChange?: (mode: TaskViewMode) => void;
  onNewTask?: () => void;
  filterStatus?: TaskStatus | "all";
  onFilterStatusChange?: (status: TaskStatus | "all") => void;
  filterPriority?: TaskPriority | "all";
  onFilterPriorityChange?: (priority: TaskPriority | "all") => void;
  filterProject?: string | "all";
  onFilterProjectChange?: (project: string | "all") => void;
  sortOption?: TaskSortOption;
  onSortChange?: (option: TaskSortOption) => void;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
};

function DropdownMenu({
  label,
  icon: Icon,
  value,
  options,
  onChange,
}: {
  label: string;
  icon: LucideIcon;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    },
    [],
  );

  const currentLabel = options.find((o) => o.value === value)?.label ?? label;

  return (
    <div ref={ref} className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "focus-ring inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium ring-1 transition-all",
          value !== "all" && value !== "newest"
            ? "bg-white/[0.08] text-white ring-white/[0.12] hover:bg-white/[0.1]"
            : "bg-white/[0.04] text-white/60 ring-white/[0.06] hover:bg-white/[0.06] hover:text-white/80",
        )}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Icon className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">{currentLabel}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full z-20 mt-1.5 min-w-[180px] overflow-hidden rounded-xl border border-white/[0.06] bg-[#0D0D14] shadow-2xl"
            role="listbox"
            aria-label={label}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={value === option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "focus-ring flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.04]",
                  value === option.value
                    ? "text-white"
                    : "text-white/50 hover:text-white/80",
                )}
              >
                <span className="flex-1">{option.label}</span>
                {value === option.value && (
                  <Check className="size-3.5 shrink-0" aria-hidden="true" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({
  label,
  icon: Icon,
  onRemove,
}: {
  label: string;
  icon: LucideIcon;
  onRemove: () => void;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-white/70 ring-1 ring-white/[0.1]"
    >
      <Icon className="size-3" aria-hidden="true" />
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex size-4 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/[0.1] hover:text-white/80"
        aria-label={`Remove filter: ${label}`}
      >
        <X className="size-3" aria-hidden="true" />
      </button>
    </motion.span>
  );
}

export const TasksToolbar = memo(function TasksToolbar({
  viewMode = "board",
  onViewModeChange,
  onNewTask,
  filterStatus = "all",
  onFilterStatusChange,
  filterPriority = "all",
  onFilterPriorityChange,
  filterProject = "all",
  onFilterProjectChange,
  sortOption = "newest",
  onSortChange,
  hasActiveFilters = false,
  onResetFilters,
  className,
}: TasksToolbarProps) {
  const statusOptions = [
    { value: "all", label: TASKS_COPY.filter.allStatuses },
    ...TASK_STATUSES.map((s) => ({
      value: s,
      label:
        s === "in-progress"
          ? "In Progress"
          : s.charAt(0).toUpperCase() + s.slice(1),
    })),
  ];

  const priorityOptions = [
    { value: "all", label: TASKS_COPY.filter.allPriorities },
    ...TASK_PRIORITIES.map((p) => ({
      value: p,
      label: p.charAt(0).toUpperCase() + p.slice(1),
    })),
  ];

  const projectOptions = [
    { value: "all", label: TASKS_COPY.filter.allProjects },
    { value: "new", label: "New" },
  ];

  const sortOptions: { value: TaskSortOption; label: string }[] = [
    { value: "newest", label: TASKS_COPY.sort.newest },
    { value: "oldest", label: TASKS_COPY.sort.oldest },
    { value: "dueDate", label: TASKS_COPY.sort.dueDate },
    { value: "priority", label: TASKS_COPY.sort.priority },
    { value: "alphabetical", label: TASKS_COPY.sort.alphabetical },
  ];

  const currentSortLabel =
    sortOptions.find((o) => o.value === sortOption)?.label ?? "Sort";

  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      role="toolbar"
      aria-label="Task actions"
    >
      {/* New Task button */}
      <div className="flex justify-end">
        <motion.button
          type="button"
          onClick={onNewTask}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[#0A0A0F] transition-shadow hover:shadow-[0_0_24px_rgba(255,255,255,0.12)] sm:shrink-0"
          aria-label={TASKS_COPY.newTaskLabel}
        >
          <Plus className="size-4" aria-hidden="true" />
          {TASKS_COPY.newTaskLabel}
        </motion.button>
      </div>

      {/* Filter/Sort row */}
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu
          label={TASKS_COPY.filterLabel}
          icon={ClipboardList}
          value={filterStatus}
          options={statusOptions}
          onChange={(v) => onFilterStatusChange?.(v as TaskStatus | "all")}
        />

        <DropdownMenu
          label={TASKS_COPY.sortLabel}
          icon={ArrowDownUp}
          value={sortOption}
          options={sortOptions}
          onChange={(v) => onSortChange?.(v as TaskSortOption)}
        />

        <DropdownMenu
          label="Priority"
          icon={Flag}
          value={filterPriority}
          options={priorityOptions}
          onChange={(v) =>
            onFilterPriorityChange?.(v as TaskPriority | "all")
          }
        />

        <DropdownMenu
          label="Project"
          icon={Filter}
          value={filterProject}
          options={projectOptions}
          onChange={(v) => onFilterProjectChange?.(v as string | "all")}
        />

        {/* View toggle */}
        <div
          className="ml-auto flex items-center rounded-xl bg-white/[0.04] p-1 ring-1 ring-white/[0.06]"
          role="group"
          aria-label="View mode"
        >
          <motion.button
            type="button"
            onClick={() => onViewModeChange?.("board")}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "focus-ring inline-flex items-center justify-center rounded-lg p-2 transition-colors",
              viewMode === "board"
                ? "bg-white/[0.08] text-white"
                : "text-white/40 hover:text-white/70",
            )}
            aria-label={TASKS_COPY.viewBoardLabel}
            aria-pressed={viewMode === "board"}
          >
            <LayoutGrid className="size-4" aria-hidden="true" />
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onViewModeChange?.("list")}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "focus-ring inline-flex items-center justify-center rounded-lg p-2 transition-colors",
              viewMode === "list"
                ? "bg-white/[0.08] text-white"
                : "text-white/40 hover:text-white/70",
            )}
            aria-label={TASKS_COPY.viewListLabel}
            aria-pressed={viewMode === "list"}
          >
            <List className="size-4" aria-hidden="true" />
          </motion.button>
        </div>
      </div>

      {/* Active filter chips */}
      {(filterStatus !== "all" || filterPriority !== "all" || filterProject !== "all" || sortOption !== "newest") && (
        <div className="flex flex-wrap items-center gap-2">
          <AnimatePresence mode="popLayout">
            {filterStatus !== "all" && (
              <FilterChip
                key="status-chip"
                label={`Status: ${statusOptions.find(o => o.value === filterStatus)?.label}`}
                icon={ClipboardList}
                onRemove={() => onFilterStatusChange?.("all")}
              />
            )}
            {filterPriority !== "all" && (
              <FilterChip
                key="priority-chip"
                label={`Priority: ${priorityOptions.find(o => o.value === filterPriority)?.label}`}
                icon={Flag}
                onRemove={() => onFilterPriorityChange?.("all")}
              />
            )}
            {filterProject !== "all" && (
              <FilterChip
                key="project-chip"
                label={`Project: ${filterProject}`}
                icon={Filter}
                onRemove={() => onFilterProjectChange?.("all")}
              />
            )}
            {sortOption !== "newest" && (
              <FilterChip
                key="sort-chip"
                label={`Sort: ${currentSortLabel}`}
                icon={ArrowDownUp}
                onRemove={() => onSortChange?.("newest")}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                key="reset-filters"
                type="button"
                onClick={onResetFilters}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                whileTap={{ scale: 0.97 }}
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                aria-label={TASKS_COPY.resetFiltersLabel}
              >
                <RotateCcw className="size-3" aria-hidden="true" />
                <span>{TASKS_COPY.resetFiltersLabel}</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
});