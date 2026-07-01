export type AssistantMessageRole = "user" | "assistant" | "system";

export type AssistantMessage = {
  id: string;
  conversationId?: string;
  role: AssistantMessageRole;
  content: string;
  status?: "pending" | "streaming" | "completed" | "error" | "cancelled";
  timestamp?: string;
  createdAt: string;
  contextIds?: string[];
};

export const ASSISTANT_MESSAGE_ROLES: readonly AssistantMessageRole[] = [
  "user",
  "assistant",
  "system",
] as const;
