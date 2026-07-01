import type { KnowledgeCategory } from "./knowledge-category";
import type { KnowledgeRelationship } from "./knowledge-relationship";
import type { KnowledgeStatus } from "./knowledge-status";
import type { KnowledgeTag } from "./knowledge-tag";

export type Knowledge = {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  category: KnowledgeCategory;
  status: KnowledgeStatus;
  tags: KnowledgeTag[];
  relationships?: KnowledgeRelationship[];
  collectionId?: string;
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeSummary = Pick<
  Knowledge,
  "id" | "title" | "category" | "status" | "tags" | "updatedAt"
> & {
  relationshipCount: number;
};

export type KnowledgeViewMode = "grid" | "list";
