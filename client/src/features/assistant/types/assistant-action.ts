export type AssistantActionType =
  | "navigate"
  | "create"
  | "search"
  | "analyze"
  | "summarize";

export type AssistantAction = {
  id: string;
  type: AssistantActionType;
  label: string;
  description?: string;
  payload?: Record<string, unknown>;
};

export const ASSISTANT_ACTION_TYPES: readonly AssistantActionType[] = [
  "navigate",
  "create",
  "search",
  "analyze",
  "summarize",
] as const;
