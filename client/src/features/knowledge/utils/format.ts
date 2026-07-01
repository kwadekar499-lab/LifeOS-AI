import type { KnowledgeStatus } from "../types/knowledge-status";

const KNOWLEDGE_STATUS_LABELS: Record<KnowledgeStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
  review: "Review",
};

export function formatKnowledgeStatus(status: KnowledgeStatus): string {
  return KNOWLEDGE_STATUS_LABELS[status];
}

export function formatCategoryLabel(label: string): string {
  return label;
}

export function formatRelationshipCount(count: number): string {
  if (count === 0) return "No connections";
  if (count === 1) return "1 connection";
  return `${count} connections`;
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
