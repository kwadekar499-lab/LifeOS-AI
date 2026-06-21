export type KnowledgeCategory = {
  id: string;
  label: string;
  slug: string;
  color?: string;
};

export type KnowledgeCategorySlug =
  | "article"
  | "note"
  | "reference"
  | "concept"
  | "project"
  | "resource";

export const KNOWLEDGE_CATEGORY_SLUGS: readonly KnowledgeCategorySlug[] = [
  "article",
  "note",
  "reference",
  "concept",
  "project",
  "resource",
] as const;
