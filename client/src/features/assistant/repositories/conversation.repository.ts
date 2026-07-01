export interface ConversationRepository {
  getConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | null>;
  createConversation(data: CreateConversationData): Promise<Conversation>;
  updateConversation(id: string, data: UpdateConversationData): Promise<Conversation>;
  deleteConversation(id: string): Promise<void>;
  archiveConversation(id: string): Promise<Conversation>;
  pinConversation(id: string): Promise<Conversation>;
  searchConversations(query: string): Promise<Conversation[]>;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  archived: boolean;
  messages: Message[];
  metadata?: Record<string, unknown>;
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  timestamp: string;
  attachments?: Attachment[];
  metadata?: Record<string, unknown>;
}

export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus = 
  | "pending" 
  | "streaming" 
  | "completed" 
  | "error" 
  | "cancelled";

export interface Attachment {
  id: string;
  type: "file" | "image" | "link";
  name: string;
  url?: string;
  size?: number;
  mimeType?: string;
}

export interface CreateConversationData {
  title?: string;
  initialMessage?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateConversationData {
  title?: string;
  pinned?: boolean;
  archived?: boolean;
  metadata?: Record<string, unknown>;
}