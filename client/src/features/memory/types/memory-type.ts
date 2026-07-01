export type MemoryType =
  | "fact"
  | "preference"
  | "event"
  | "insight"
  | "reference"
  | "person"
  | "note";

export const MEMORY_TYPES: readonly MemoryType[] = [
  "fact",
  "preference",
  "event",
  "insight",
  "reference",
  "person",
  "note",
] as const;
