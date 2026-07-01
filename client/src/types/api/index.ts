// Centralized API Types & DTOs for LifeOS AI

// --- General API Response Envelope ---
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    requestId?: string;
    details?: unknown;
  };
}

// --- Authentication ---
export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string | null;
  avatar?: string | null;
  timezone?: string | null;
  locale?: string | null;
  emailVerified: boolean;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password?: string; // Optional depending on OAuth/OTP flows, but standard for local credentials
}

export interface RegisterDto {
  email: string;
  username: string;
  password?: string;
  fullName?: string;
}

export interface AuthData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

// --- Assistant ---
export interface ChatRequestDto {
  conversationId?: string;
  message: string;
  provider?: string;
  model?: string;
}

export interface ChatResponseData {
  requestId: string;
  userId: string;
  conversationId: string;
  message: {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: string;
  };
  response?: string; // Full text response
}

// --- Memory ---
export interface MemoryItem {
  id: string;
  userId: string;
  content: string;
  category?: string | null;
  tags: string[];
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateMemoryDto {
  content: string;
  category?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateMemoryDto {
  content?: string;
  category?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface SearchMemoryDto {
  q?: string;
  category?: string;
  tags?: string[];
  limit?: number;
}

// --- Knowledge ---
export interface KnowledgeItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  category?: string | null;
  tags: string[];
  sourceUrl?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateKnowledgeDto {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  sourceUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateKnowledgeDto {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  sourceUrl?: string;
  metadata?: Record<string, unknown>;
}

// --- Journal ---
export interface JournalEntry {
  id: string;
  userId: string;
  title?: string | null;
  content: string;
  mood?: string | null;
  tags: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateJournalDto {
  content: string;
  title?: string;
  mood?: string;
  tags?: string[];
  date?: string;
}

export interface UpdateJournalDto {
  content?: string;
  title?: string;
  mood?: string;
  tags?: string[];
  date?: string;
}

// --- Tasks ---
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
}

// --- Files ---
export interface FileUploadData {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  userId: string;
  createdAt: string;
}

export interface UploadFileDto {
  source?: 'manual' | 'import' | 'attachment';
  sourceUrl?: string;
  metadata?: Record<string, unknown>;
}

// --- Parser ---
export interface DocumentParserData {
  fileId: string;
  success: boolean;
  pageCount?: number;
  characterCount?: number;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  fileId: string;
  userId: string;
  content: string;
  chunkIndex: number;
  metadata?: Record<string, unknown> | null;
}

// --- Embeddings ---
export interface EmbeddingMetadata {
  id: string;
  chunkId: string;
  provider: string;
  model: string;
  dimensions: number;
  tokenCount: number;
  latencyMs?: number;
  costEstimate?: number;
  createdAt: string;
}

export interface GenerateEmbeddingDto {
  provider?: string;
  model?: string;
}

// --- Vector Search ---
export interface SearchVectorDto {
  query: string;
  topK?: number;
  threshold?: number;
  fileIds?: string[];
  knowledgeIds?: string[];
  documentIds?: string[];
  provider?: string;
}

export interface VectorSearchResultItem {
  chunkId: string;
  chunkContent: string;
  score: number;
  fileId: string;
  chunkIndex: number;
  provider: string;
  similarity: number;
  metadata?: Record<string, unknown> | null;
}

export interface VectorSearchResponse {
  queryId: string;
  query: string;
  provider: string;
  topK: number;
  latency: number;
  results: VectorSearchResultItem[];
}

export interface BatchSearchVectorDto {
  queries: {
    query: string;
    topK?: number;
    threshold?: number;
  }[];
}

// --- RAG ---
export interface RagQueryDto {
  query: string;
  topK?: number;
  threshold?: number;
  temperature?: number;
  provider?: string;
  model?: string;
}

export interface RagResponseData {
  answer: string;
  sources: {
    chunkId: string;
    content: string;
    score: number;
    fileId?: string;
    title?: string;
  }[];
  query: string;
}

// --- Tools ---
export interface ToolMetadata {
  displayName: string;
  description: string;
  examples: string[];
  tags: string[];
  permissions: { action: string; resource: string }[];
  estimatedExecutionTime: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'Tasks' | 'Memory' | 'Knowledge' | 'Journal' | 'System' | 'Search';
  version: string;
  enabled: boolean;
  requiresConfirmation: boolean;
  permissions: { action: string; resource: string }[];
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  metadata: ToolMetadata;
}

// --- Conversations ---
export interface Conversation {
  id: string;
  userId: string;
  workspaceId?: string | null;
  title?: string | null;
  summary?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Message {
  id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  status: 'PENDING' | 'STREAMING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  provider?: string | null;
  model?: string | null;
  tokenInput?: number | null;
  tokenOutput?: number | null;
  latency?: number | null;
  attachments?: unknown | null;
  toolCalls?: unknown | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateConversationDto {
  title?: string;
  workspaceId?: string;
}

export interface UpdateConversationDto {
  title?: string;
}

