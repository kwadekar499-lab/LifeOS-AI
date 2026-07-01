export type KnowledgeRelationshipType =
  | "references"
  | "extends"
  | "contradicts"
  | "related"
  | "part_of";

export type KnowledgeRelationship = {
  id: string;
  sourceId: string;
  targetId: string;
  type: KnowledgeRelationshipType;
};

export const KNOWLEDGE_RELATIONSHIP_TYPES: readonly KnowledgeRelationshipType[] =
  [
    "references",
    "extends",
    "contradicts",
    "related",
    "part_of",
  ] as const;
