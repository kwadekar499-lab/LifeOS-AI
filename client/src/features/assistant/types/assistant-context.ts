export type AssistantContextSource =
  | "memory"
  | "knowledge"
  | "tasks"
  | "journal"
  | "search";

export type AssistantContext = {
  memoryEnabled: boolean;
  knowledgeEnabled: boolean;
  tasksEnabled: boolean;
  journalEnabled: boolean;
  searchEnabled: boolean;
  activeSource?: AssistantContextSource;
  selectedIds?: string[];
};

export const ASSISTANT_CONTEXT_SOURCES: readonly AssistantContextSource[] = [
  "memory",
  "knowledge",
  "tasks",
  "journal",
  "search",
] as const;

export const DEFAULT_ASSISTANT_CONTEXT: AssistantContext = {
  memoryEnabled: true,
  knowledgeEnabled: true,
  tasksEnabled: false,
  journalEnabled: false,
  searchEnabled: false,
};
