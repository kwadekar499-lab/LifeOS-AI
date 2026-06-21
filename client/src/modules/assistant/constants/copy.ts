import type { AssistantSuggestion } from "../types";

export const ASSISTANT_COPY = {
  title: "Assistant",
  description:
    "Your intelligence layer — reason across memories, knowledge, and context to make better decisions.",
  contextSelectorLabel: "Context",
  contextSelectorPlaceholder: "All sources",
  memoryToggleLabel: "Memory",
  knowledgeToggleLabel: "Knowledge",
  clearConversationLabel: "Clear conversation",
  settingsLabel: "Assistant settings",
  promptPlaceholder:
    "Ask LifeOS to reason across your memories and knowledge…",
  attachLabel: "Attach file",
  voiceLabel: "Voice input",
  sendLabel: "Send message",
  emptyState: {
    title: "Intelligence at your command",
    description:
      "Ask LifeOS to reason across your memories and knowledge. Connect context from across your life to think clearly and decide with confidence.",
  },
  suggestions: [
    {
      id: "synthesize",
      label: "Synthesize context",
      prompt: "Synthesize what LifeOS knows about my current priorities.",
    },
    {
      id: "connect",
      label: "Connect ideas",
      prompt: "Find connections between my recent memories and knowledge.",
    },
    {
      id: "decide",
      label: "Support a decision",
      prompt: "Help me weigh options based on what LifeOS knows about me.",
    },
    {
      id: "reflect",
      label: "Reflect and plan",
      prompt: "Reflect on my recent journal entries and suggest next steps.",
    },
  ] satisfies AssistantSuggestion[],
} as const;
