import type { AssistantContext } from "./assistant-context";
import type { AssistantMessage } from "./assistant-message";

export type AssistantConversation = {
  id: string;
  title?: string;
  messages: AssistantMessage[];
  context: AssistantContext;
  createdAt: string;
  updatedAt: string;
};

export type AssistantConversationSummary = Pick<
  AssistantConversation,
  "id" | "title" | "updatedAt"
> & {
  messageCount: number;
};
