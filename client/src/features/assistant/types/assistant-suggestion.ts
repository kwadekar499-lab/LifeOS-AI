import type { AssistantContextSource } from "./assistant-context";

export type AssistantSuggestion = {
  id: string;
  label: string;
  prompt: string;
  source?: AssistantContextSource;
};
