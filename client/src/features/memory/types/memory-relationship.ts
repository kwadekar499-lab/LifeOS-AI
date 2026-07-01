export type MemoryRelationshipType =
  | "related_to"
  | "derived_from"
  | "contradicts"
  | "supports";

export type MemoryRelationship = {
  id: string;
  sourceId: string;
  targetId: string;
  type: MemoryRelationshipType;
};

export const MEMORY_RELATIONSHIP_TYPES: readonly MemoryRelationshipType[] = [
  "related_to",
  "derived_from",
  "contradicts",
  "supports",
] as const;
