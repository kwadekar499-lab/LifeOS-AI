import type { TaskLabel } from "./task-label";
import type { TaskPriority } from "./task-priority";
import type { TaskProject } from "./task-project";
import type { TaskStatus } from "./task-status";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  labels: TaskLabel[];
  project?: TaskProject;
  createdAt: string;
  updatedAt: string;
};

export type TaskSummary = Pick<
  Task,
  "id" | "title" | "status" | "priority" | "labels" | "updatedAt"
>;