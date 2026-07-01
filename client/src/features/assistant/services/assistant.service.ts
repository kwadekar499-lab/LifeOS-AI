export interface AssistantService {
  sendMessage(
    conversationId: string,
    content: string,
    options?: SendMessageOptions
  ): Promise<MessageResponse>;
  
  streamMessage(
    conversationId: string,
    content: string,
    options?: StreamMessageOptions
  ): Promise<StreamResponse>;
  
  cancelGeneration(conversationId: string): Promise<void>;
}

export interface SendMessageOptions {
  context?: AssistantContext;
  tools?: ToolDefinition[];
  metadata?: Record<string, unknown>;
}

export interface StreamMessageOptions extends SendMessageOptions {
  onToken?: (token: string) => void;
  onComplete?: (message: MessageResponse) => void;
  onError?: (error: Error) => void;
  onStatusChange?: (status: MessageStatus) => void;
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  role: "assistant";
  content: string;
  status: MessageStatus;
  timestamp: string;
  metadata?: Record<string, unknown>;
  toolCalls?: ToolCall[];
}

export interface StreamResponse {
  id: string;
  conversationId: string;
  role: "assistant";
  content: string;
  status: MessageStatus;
  timestamp: string;
  metadata?: Record<string, unknown>;
  toolCalls?: ToolCall[];
}

export type MessageStatus = 
  | "pending" 
  | "streaming" 
  | "completed" 
  | "error" 
  | "cancelled";

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: ToolParameter[];
  execute: (params: Record<string, unknown>) => Promise<ToolResult>;
}

export interface ToolParameter {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  description: string;
  required: boolean;
}

export interface ToolCall {
  id: string;
  name: string;
  parameters: Record<string, unknown>;
  result?: ToolResult;
  status: "pending" | "executing" | "completed" | "error";
}

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface AssistantProvider {
  name: string;
  sendMessage: (prompt: string, context?: Record<string, unknown>) => Promise<string>;
  streamMessage?: (
    prompt: string,
    context?: Record<string, unknown>,
    callbacks?: {
      onToken: (token: string) => void;
      onComplete: (response: string) => void;
      onError: (error: Error) => void;
    }
  ) => Promise<void>;
  cancel?: () => Promise<void>;
}

export interface AssistantContext {
  memoryEnabled: boolean;
  knowledgeEnabled: boolean;
  tasksEnabled: boolean;
  journalEnabled: boolean;
  searchEnabled: boolean;
  toolsEnabled: boolean;
}