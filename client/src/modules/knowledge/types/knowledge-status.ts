export type KnowledgeStatus =
  | "draft"
  | "published"
  | "archived"
  | "review";

export const KNOWLEDGE_STATUSES: readonly KnowledgeStatus[] = [
  "draft",
  "published",
  "archived",
  "review",
] as const;
