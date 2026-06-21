export type AssistantMessageRole = "user" | "assistant" | "system";

export type AssistantMessage = {
  id: string;
  role: AssistantMessageRole;
  content: string;
  createdAt: string;
  contextIds?: string[];
};

export const ASSISTANT_MESSAGE_ROLES: readonly AssistantMessageRole[] = [
  "user",
  "assistant",
  "system",
] as const;
