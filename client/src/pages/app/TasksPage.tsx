import { useState, useCallback, useMemo, useEffect } from "react";
import {
  TasksHeader,
  TasksToolbar,
  TasksBoard,
  TasksList,
  TasksStats,
  TasksProgress,
  TasksSkeleton,
  NewTaskDialog,
} from "@/features/tasks/components";
import { TasksEmptyState } from "@/features/tasks/components/TasksEmptyState";
import type { TaskViewMode, TaskSortOption } from "@/features/tasks/components";
import type { Task, TaskStatus, TaskPriority } from "@/features/tasks/types";
import { useTaskKeyboard } from "@/features/tasks/hooks/useTaskKeyboard";
import { useSearchRegistration } from "@/features/search/hooks/useSearchRegistration";


const TASKS_STORAGE_KEY = "lifeos-tasks";

function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadTasksFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is Task => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        typeof item.status === "string" &&
        typeof item.priority === "string" &&
        typeof item.createdAt === "string" &&
        typeof item.updatedAt === "string"
      );
    });
  } catch {
    return [];
  }
}

function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // ignore storage errors
  }
}

const PRIORITY_RANK: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function TasksPage() {
  const [viewMode, setViewMode] = useState<TaskViewMode>("board");
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">(
    "all",
  );
  const [filterProject, setFilterProject] = useState<string | "all">("all");

  // Sort state
  const [sortOption, setSortOption] = useState<TaskSortOption>("newest");

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  const handleOpenDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleCreateTask = useCallback(
    (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      setTasks((prev) => [newTask, ...prev]);
      setDialogOpen(false);
    },
    [],
  );

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const handleToggleTaskStatus = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const newStatus: TaskStatus =
          task.status === "done" ? "todo" : "done";
        return {
          ...task,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  }, []);

  const handleTaskSelect = useCallback(() => {
    // Task selection handled by parent component
  }, []);

  const handleFilterStatusChange = useCallback(
    (status: TaskStatus | "all") => {
      setFilterStatus(status);
    },
    [],
  );

  const handleFilterPriorityChange = useCallback(
    (priority: TaskPriority | "all") => {
      setFilterPriority(priority);
    },
    [],
  );

  const handleFilterProjectChange = useCallback(
    (project: string | "all") => {
      setFilterProject(project);
    },
    [],
  );

  const handleSortChange = useCallback((option: TaskSortOption) => {
    setSortOption(option);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilterStatus("all");
    setFilterPriority("all");
    setFilterProject("all");
    setSortOption("newest");
  }, []);

  const navigateToTasks = useCallback(() => {
    // Already on tasks page, scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Register with Global Search
  useSearchRegistration({
    tasks,
    onNavigateToTasks: navigateToTasks,
  });

  // Keyboard shortcuts
  useTaskKeyboard({
    onNewTask: handleOpenDialog,
    onCloseDialog: handleCloseDialog,
    dialogOpen,
  });

  // Listen for command palette "New Task" action
  useEffect(() => {
    const handler = () => {
      setDialogOpen(true);
    };
    window.addEventListener("open-new-task-dialog", handler);
    return () => window.removeEventListener("open-new-task-dialog", handler);
  }, []);

  // Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "done").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const highPriority = tasks.filter(
      (t) => t.priority === "high" && t.status !== "done",
    ).length;
    const now = new Date();
    const overdue = tasks.filter((t) => {
      if (!t.dueDate || t.status === "done") return false;
      return new Date(t.dueDate) < now;
    }).length;
    return { total, completed, inProgress, highPriority, overdue };
  }, [tasks]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filterStatus !== "all" && task.status !== filterStatus) return false;
      if (filterPriority !== "all" && task.priority !== filterPriority)
        return false;
      if (filterProject !== "all") {
        if (filterProject === "new") {
          // Special filter: return only the most recently created task(s)
          const maxCreatedAt = tasks.reduce((max, t) => {
            const timestamp = new Date(t.createdAt).getTime();
            return timestamp > max ? timestamp : max;
          }, 0);
          if (maxCreatedAt === 0) return false;
          if (new Date(task.createdAt).getTime() !== maxCreatedAt) return false;
        } else if (task.project?.name !== filterProject) {
          return false;
        }
      }
      return true;
    });
  }, [tasks, filterStatus, filterPriority, filterProject]);

  // Sorted tasks
  const sortedTasks = useMemo(() => {
    const sorted = [...filteredTasks];
    switch (sortOption) {
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "dueDate":
        sorted.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
      case "priority":
        sorted.sort(
          (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority],
        );
        break;
      case "alphabetical":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return sorted;
  }, [filteredTasks, sortOption]);

  // Determine empty state
  const hasActiveFilters =
    filterStatus !== "all" ||
    filterPriority !== "all" ||
    filterProject !== "all" ||
    sortOption !== "newest" ||
    viewMode !== "board";

  const allCompleted =
    tasks.length > 0 && tasks.every((t) => t.status === "done");

  const showEmptySearch =
    tasks.length > 0 && sortedTasks.length === 0 && hasActiveFilters;

  const showAllCompleted = allCompleted && sortedTasks.length === 0;

  const showNoTasks = tasks.length === 0;

  // Determine empty state variant
  let emptyVariant: "no-tasks" | "no-results" | "all-completed" = "no-tasks";
  if (showEmptySearch) emptyVariant = "no-results";
  else if (showAllCompleted) emptyVariant = "all-completed";

  return (
    <div className="flex h-full flex-col">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex h-full flex-col gap-6">
          <TasksHeader />

          {/* Statistics Dashboard */}
          {!loading && tasks.length > 0 && (
            <TasksStats
              total={stats.total}
              completed={stats.completed}
              inProgress={stats.inProgress}
              highPriority={stats.highPriority}
              overdue={stats.overdue}
            />
          )}

          {/* Progress Section */}
          {!loading && tasks.length > 0 && (
            <TasksProgress
              completed={stats.completed}
              total={stats.total}
            />
          )}

          <TasksToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onNewTask={handleOpenDialog}
            filterStatus={filterStatus}
            onFilterStatusChange={handleFilterStatusChange}
            filterPriority={filterPriority}
            onFilterPriorityChange={handleFilterPriorityChange}
            filterProject={filterProject}
            onFilterProjectChange={handleFilterProjectChange}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
          />

          <div className="flex flex-1 flex-col">
            {loading ? (
              <TasksSkeleton count={8} viewMode={viewMode} />
            ) : showNoTasks || showEmptySearch || showAllCompleted ? (
              <TasksEmptyState
                variant={emptyVariant}
                onAction={handleOpenDialog}
              />
            ) : viewMode === "board" ? (
              <TasksBoard
                tasks={sortedTasks}
                onTaskSelect={handleTaskSelect}
                onTaskDelete={handleDeleteTask}
                onTaskToggleStatus={handleToggleTaskStatus}
                onCreateTask={handleOpenDialog}
              />
            ) : (
              <TasksList
                tasks={sortedTasks}
                viewMode={viewMode}
                onTaskSelect={handleTaskSelect}
                onTaskDelete={handleDeleteTask}
                onTaskToggleStatus={handleToggleTaskStatus}
                onCreateTask={handleOpenDialog}
              />
            )}
          </div>
        </div>
      </div>

      <NewTaskDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleCreateTask}
        existingTitles={tasks.map((t) => t.title)}
        onTitleCreated={() => {
          // Title is already added to history in NewTaskDialog via useRecentTitles
        }}
      />
    </div>
  );
}

export default TasksPage;