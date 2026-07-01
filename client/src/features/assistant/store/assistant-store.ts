import { create } from "zustand";
import type { AssistantMessage, AssistantContext } from "../types";

export type AssistantStatus = "idle" | "loading" | "streaming" | "error";

export interface AssistantState {
  messages: AssistantMessage[];
  status: AssistantStatus;
  context: AssistantContext;
  input: string;
  error: string | null;
}

export interface AssistantActions {
  setInput: (input: string) => void;
  sendMessage: (content: string) => Promise<void>;
  stopGenerating: () => void;
  clearConversation: () => void;
  regenerateLastMessage: () => void;
  copyMessage: (messageId: string) => void;
  setContext: (context: Partial<AssistantContext>) => void;
  setStatus: (status: AssistantStatus) => void;
  setError: (error: string | null) => void;
}

export type AssistantStore = AssistantState & AssistantActions;

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

export const useAssistantStore = create<AssistantStore>((set, get) => ({
  messages: [],
  status: "idle",
  context: {
    memoryEnabled: true,
    knowledgeEnabled: true,
    tasksEnabled: false,
    journalEnabled: false,
    searchEnabled: false,
  },
  input: "",
  error: null,

  setInput: (input) => set({ input }),

  sendMessage: async (content) => {
    const userMessage: AssistantMessage = {
      id: generateId(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      input: "",
      status: "loading",
      error: null,
    }));

    // Simulate AI response for frontend foundation
    setTimeout(() => {
      const assistantMessage: AssistantMessage = {
        id: generateId(),
        role: "assistant",
        content: "This is a simulated response. Backend AI integration coming soon.",
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        status: "idle",
      }));
    }, 1500);
  },

  stopGenerating: () => {
    set({ status: "idle" });
  },

  clearConversation: () => {
    set({ messages: [], status: "idle", error: null });
  },

  regenerateLastMessage: () => {
    const { messages } = get();
    const lastUserMessageIndex = messages.findLastIndex(
      (m) => m.role === "user",
    );

    if (lastUserMessageIndex === -1) return;

    const messagesBeforeRegeneration = messages.slice(0, lastUserMessageIndex);

    set({
      messages: messagesBeforeRegeneration,
      status: "loading",
      error: null,
    });

    setTimeout(() => {
      const assistantMessage: AssistantMessage = {
        id: generateId(),
        role: "assistant",
        content: "Regenerated response. Backend AI integration coming soon.",
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        status: "idle",
      }));
    }, 1500);
  },

  copyMessage: (messageId) => {
    const { messages } = get();
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      navigator.clipboard.writeText(message.content);
    }
  },

  setContext: (contextUpdate) => {
    set((state) => ({
      context: { ...state.context, ...contextUpdate },
    }));
  },

  setStatus: (status) => set({ status }),

  setError: (error) => set({ error }),
}));