import type { MemoryStatus } from "../types/memory-status";
import type { MemoryType } from "../types/memory-type";

const MEMORY_TYPE_LABELS: Record<MemoryType, string> = {
  fact: "Fact",
  preference: "Preference",
  event: "Event",
  insight: "Insight",
  reference: "Reference",
  person: "Person",
  note: "Note",
};

const MEMORY_STATUS_LABELS: Record<MemoryStatus, string> = {
  active: "Active",
  archived: "Archived",
  pending: "Pending",
  review: "Review",
};

export function formatMemoryType(type: MemoryType): string {
  return MEMORY_TYPE_LABELS[type];
}

export function formatMemoryStatus(status: MemoryStatus): string {
  return MEMORY_STATUS_LABELS[status];
}

export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
