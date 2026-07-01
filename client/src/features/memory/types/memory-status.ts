export type MemoryStatus = "active" | "archived" | "pending" | "review";

export const MEMORY_STATUSES: readonly MemoryStatus[] = [
  "active",
  "archived",
  "pending",
  "review",
] as const;
