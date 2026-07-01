import type { 
  ConversationRepository, 
  Conversation, 
  Message, 
  CreateConversationData,
  UpdateConversationData 
} from "./conversation.repository";

const STORAGE_KEY = "lifeos_assistant_conversations";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createMessage(
  role: Message["role"],
  content: string,
  conversationId: string
): Message {
  return {
    id: generateId(),
    conversationId,
    role,
    content,
    status: "completed",
    timestamp: new Date().toISOString(),
  };
}

export function createMockConversationRepository(): ConversationRepository {
  const loadConversations = (): Conversation[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveConversations = (conversations: Conversation[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  };

  return {
    getConversations: async (): Promise<Conversation[]> => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return loadConversations();
    },

    getConversation: async (id: string): Promise<Conversation | null> => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const conversations = loadConversations();
      return conversations.find((c) => c.id === id) || null;
    },

    createConversation: async (data: CreateConversationData): Promise<Conversation> => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const conversations = loadConversations();
      
      const now = new Date().toISOString();
      const conversation: Conversation = {
        id: generateId(),
        title: data.title || "New Conversation",
        createdAt: now,
        updatedAt: now,
        pinned: false,
        archived: false,
        messages: data.initialMessage
          ? [createMessage("user", data.initialMessage, "")]
          : [],
        metadata: data.metadata,
      };

      conversation.messages = conversation.messages.map((msg) => ({
        ...msg,
        conversationId: conversation.id,
      }));

      conversations.unshift(conversation);
      saveConversations(conversations);
      return conversation;
    },

    updateConversation: async (id: string, data: UpdateConversationData): Promise<Conversation> => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const conversations = loadConversations();
      const existing = conversations.find((c) => c.id === id);
      
      if (!existing) {
        throw new Error(`Conversation ${id} not found`);
      }

      const updated: Conversation = {
        id: existing.id,
        title: data.title ?? existing.title,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
        pinned: data.pinned ?? existing.pinned,
        archived: data.archived ?? existing.archived,
        messages: existing.messages,
        metadata: data.metadata ?? existing.metadata,
      };

      const index = conversations.findIndex((c) => c.id === id);
      conversations[index] = updated;
      saveConversations(conversations);
      return updated;
    },

    deleteConversation: async (id: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const conversations = loadConversations();
      const filtered = conversations.filter((c) => c.id !== id);
      saveConversations(filtered);
    },

    archiveConversation: async (id: string): Promise<Conversation> => {
      const conversations = loadConversations();
      const existing = conversations.find((c) => c.id === id);
      
      if (!existing) {
        throw new Error(`Conversation ${id} not found`);
      }

      const updated: Conversation = {
        id: existing.id,
        title: existing.title,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
        pinned: existing.pinned,
        archived: true,
        messages: existing.messages,
        metadata: existing.metadata,
      };

      const index = conversations.findIndex((c) => c.id === id);
      conversations[index] = updated;
      saveConversations(conversations);
      return updated;
    },

    pinConversation: async (id: string): Promise<Conversation> => {
      const conversations = loadConversations();
      const existing = conversations.find((c) => c.id === id);
      
      if (!existing) {
        throw new Error(`Conversation ${id} not found`);
      }

      const updated: Conversation = {
        id: existing.id,
        title: existing.title,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
        pinned: true,
        archived: existing.archived,
        messages: existing.messages,
        metadata: existing.metadata,
      };

      const index = conversations.findIndex((c) => c.id === id);
      conversations[index] = updated;
      saveConversations(conversations);
      return updated;
    },

    searchConversations: async (query: string): Promise<Conversation[]> => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const conversations = loadConversations();
      const normalizedQuery = query.toLowerCase().trim();
      
      if (!normalizedQuery) return [];

      return conversations.filter((c) => {
        const matchesTitle = c.title.toLowerCase().includes(normalizedQuery);
        const matchesContent = c.messages.some((m) =>
          m.content.toLowerCase().includes(normalizedQuery)
        );
        return matchesTitle || matchesContent;
      });
    },
  };
}

export const mockConversationRepository = createMockConversationRepository();