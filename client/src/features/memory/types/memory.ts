import type { MemoryRelationship } from "./memory-relationship";
import type { MemoryStatus } from "./memory-status";
import type { MemoryTag } from "./memory-tag";
import type { MemoryType } from "./memory-type";

export type Memory = {
  id: string;
  title: string;
  content?: string;
  type: MemoryType;
  status: MemoryStatus;
  tags: MemoryTag[];
  relationships?: MemoryRelationship[];
  createdAt: string;
  updatedAt: string;
  confidence?: number;
};

export type MemorySummary = Pick<
  Memory,
  "id" | "title" | "type" | "status" | "tags" | "updatedAt"
>;
