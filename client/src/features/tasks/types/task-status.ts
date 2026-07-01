export type TaskStatus = "todo" | "in-progress" | "done" | "blocked";

export const TASK_STATUSES: readonly TaskStatus[] = [
  "todo",
  "in-progress",
  "done",
  "blocked",
] as const;