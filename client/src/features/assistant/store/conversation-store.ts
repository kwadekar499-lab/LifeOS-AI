import { create } from "zustand";
import type { Conversation, Message, ConversationRepository } from "../repositories/conversation.repository";
import type { AssistantService, AssistantContext, MessageStatus } from "../services/assistant.service";

export interface ConversationState {
  // Current conversation
  currentConversation: Conversation | null;
  
  // All conversations
  conversations: Conversation[];
  
  // UI state
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  
  // Sidebar state
  isSidebarOpen: boolean;
  searchQuery: string;
  
  // Context
  context: AssistantContext;
}

export interface ConversationActions {
  // Conversation CRUD
  loadConversations: () => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  createConversation: (data?: { title?: string; initialMessage?: string }) => Promise<Conversation>;
  updateConversation: (id: string, data: { title?: string; pinned?: boolean; archived?: boolean }) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  archiveConversation: (id: string) => Promise<void>;
  pinConversation: (id: string) => Promise<void>;
  
  // Message operations
  sendMessage: (content: string) => Promise<void>;
  stopGenerating: () => Promise<void>;
  regenerateMessage: (messageId: string) => Promise<void>;
  copyMessage: (messageId: string) => Promise<void>;
  
  // UI actions
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setContext: (context: Partial<AssistantContext>) => void;
  clearError: () => void;
}

export type ConversationStore = ConversationState & ConversationActions;

export const createConversationStore = (
  repository: ConversationRepository,
  assistantService: AssistantService
) => {
  return create<ConversationStore>((set, get) => ({
    // Initial state
    currentConversation: null,
    conversations: [],
    isLoading: false,
    isSending: false,
    error: null,
    isSidebarOpen: false,
    searchQuery: "",
    context: {
      memoryEnabled: true,
      knowledgeEnabled: true,
      tasksEnabled: false,
      journalEnabled: false,
      searchEnabled: false,
      toolsEnabled: false,
    },

    // Load all conversations
    loadConversations: async () => {
      set({ isLoading: true, error: null });
      try {
        const conversations = await repository.getConversations();
        set({ conversations, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : "Failed to load conversations",
          isLoading: false 
        });
      }
    },

    // Select a conversation
    selectConversation: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        const conversation = await repository.getConversation(id);
        if (conversation) {
          set({ currentConversation: conversation, isLoading: false });
        } else {
          set({ error: "Conversation not found", isLoading: false });
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : "Failed to load conversation",
          isLoading: false 
        });
      }
    },

    // Create new conversation
    createConversation: async (data = {}) => {
      set({ isLoading: true, error: null });
      try {
        const conversation = await repository.createConversation({
          title: data.title,
          initialMessage: data.initialMessage,
        });
        
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          currentConversation: conversation,
          isLoading: false,
        }));
        
        return conversation;
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : "Failed to create conversation",
          isLoading: false 
        });
        throw error;
      }
    },

    // Update conversation
    updateConversation: async (id: string, data) => {
      try {
        const updated = await repository.updateConversation(id, data);
        set((state) => ({
          conversations: state.conversations.map((c) => 
            c.id === id ? updated : c
          ),
          currentConversation: state.currentConversation?.id === id 
            ? updated 
            : state.currentConversation,
        }));
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : "Failed to update conversation"
        });
        throw error;
      }
    },

    // Delete conversation
    deleteConversation: async (id: string) => {
      try {
        await repository.deleteConversation(id);
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          currentConversation: state.currentConversation?.id === id 
            ? null 
            : state.currentConversation,
        }));
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : "Failed to delete conversation"
        });
        throw error;
      }
    },

    // Archive conversation
    archiveConversation: async (id: string) => {
      try {
        const updated = await repository.archiveConversation(id);
        set((state) => ({
          conversations: state.conversations.map((c) => 
            c.id === id ? updated : c
          ),
          currentConversation: state.currentConversation?.id === id 
            ? updated 
            : state.currentConversation,
        }));
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : "Failed to archive conversation"
        });
        throw error;
      }
    },

    // Pin conversation
    pinConversation: async (id: string) => {
      try {
        const updated = await repository.pinConversation(id);
        set((state) => ({
          conversations: state.conversations.map((c) => 
            c.id === id ? updated : c
          ),
          currentConversation: state.currentConversation?.id === id 
            ? updated 
            : state.currentConversation,
        }));
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : "Failed to pin conversation"
        });
        throw error;
      }
    },

    // Send message
    sendMessage: async (content: string) => {
      const { currentConversation, context } = get();
      if (!currentConversation) return;

      set({ isSending: true, error: null });

      try {
        // Add user message
        const userMessage: Message = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          conversationId: currentConversation.id,
          role: "user",
          content,
          status: "completed",
          timestamp: new Date().toISOString(),
        };

        const updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, userMessage],
          updatedAt: new Date().toISOString(),
        };

        set({ currentConversation: updatedConversation });

        // Send to AI service
        const response = await assistantService.sendMessage(
          currentConversation.id,
          content,
          { context }
        );

        // Add assistant message
        const assistantMessage: Message = {
          id: response.id,
          conversationId: response.conversationId,
          role: response.role,
          content: response.content,
          status: response.status as MessageStatus,
          timestamp: response.timestamp,
          metadata: response.metadata,
        };

        const finalConversation = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, assistantMessage],
        };

        set({ 
          currentConversation: finalConversation,
          isSending: false 
        });

        // Update in repository
        await repository.updateConversation(currentConversation.id, {
          title: updatedConversation.title,
        });

      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : "Failed to send message",
          isSending: false 
        });
      }
    },

    // Stop generating
    stopGenerating: async () => {
      try {
        await assistantService.cancelGeneration(get().currentConversation?.id || "");
        set({ isSending: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : "Failed to stop generation"
        });
      }
    },

    // Regenerate message
    regenerateMessage: async (messageId: string): Promise<void> => {
      const { currentConversation } = get();
      if (!currentConversation) return;

      const messageIndex = currentConversation.messages.findIndex((m: Message) => m.id === messageId);
      if (messageIndex === -1) return;

      // Remove this message and all after it
      const messagesBefore = currentConversation.messages.slice(0, messageIndex);
      const lastUserMessage = [...messagesBefore].reverse().find((m: Message) => m.role === "user");
      
      if (!lastUserMessage) return;

      const updatedConversation = {
        ...currentConversation,
        messages: messagesBefore,
      };

      set({ currentConversation: updatedConversation });

      // Resend the last user message
      await get().sendMessage(lastUserMessage.content);
    },

    // Copy message
    copyMessage: async (messageId: string): Promise<void> => {
      const { currentConversation } = get();
      if (!currentConversation) return;

      const message = currentConversation.messages.find((m: Message) => m.id === messageId);
      if (message) {
        await navigator.clipboard.writeText(message.content);
      }
    },

    // UI actions
    setSidebarOpen: (open: boolean) => {
      set({ isSidebarOpen: open });
    },

    setSearchQuery: (query: string) => {
      set({ searchQuery: query });
    },

    setContext: (contextUpdate) => {
      set((state) => ({
        context: { ...state.context, ...contextUpdate },
      }));
    },

    clearError: () => {
      set({ error: null });
    },
  }));
};

// Create and export the singleton store instance
import { mockConversationRepository } from "../repositories/mock-conversation.repository";
import { mockAssistantService } from "../services/mock-assistant.service";

export const useAssistantStore = createConversationStore(
  mockConversationRepository,
  mockAssistantService
);

// Store is already exported above
