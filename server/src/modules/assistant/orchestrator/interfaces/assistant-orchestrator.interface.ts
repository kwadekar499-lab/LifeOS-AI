export type AssistantIntent =
  | 'general_chat'
  | 'task_management'
  | 'memory_retrieval'
  | 'knowledge_search'
  | 'journal'
  | 'conversation_search'
  | 'mixed'
  | 'unknown';

export interface AssistantOrchestrator {
  processRequest(params: ProcessRequestParams): Promise<AssistantResponse>;
  processStreamingRequest(params: ProcessRequestParams): Promise<AssistantResponse>;
  recoverFromFailure(params: RecoveryParams): Promise<AssistantResponse>;
}

export interface ProcessRequestParams {
  requestId: string;
  userId: string;
  conversationId?: string;
  message: string;
  provider?: string;
  model?: string;
  stream?: boolean;
}

export interface AssistantResponse {
  conversationId: string;
  messageId: string;
  response: string;
  intent: AssistantIntent;
  toolExecutions?: any[];
  provider: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latency: {
    totalLatency: number;
    contextBuildTime?: number;
    promptBuildTime?: number;
    providerLatency?: number;
    toolLatency?: number;
  };
  metadata: {
    requestId: string;
    conversationId: string;
    userId: string;
    timestamp: Date;
    provider: string;
    model: string;
    toolsExecuted: string[];
    streaming: boolean;
  };
}

export interface RecoveryParams {
  requestId: string;
  userId: string;
  conversationId: string;
  failedAt: 'context' | 'prompt' | 'provider' | 'tool' | 'streaming' | 'persistence';
  originalParams: ProcessRequestParams;
  error: Error;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface LatencyMetrics {
  totalLatency: number;
  contextBuildTime?: number;
  promptBuildTime?: number;
  providerLatency?: number;
  toolLatency?: number;
}

export interface ResponseMetadata {
  requestId: string;
  conversationId: string;
  userId: string;
  timestamp: Date;
  provider: string;
  model: string;
  toolsExecuted: string[];
  streaming: boolean;
}

export interface AssistantMetrics {
  totalLatency: number;
  contextBuildTime: number;
  promptBuildTime: number;
  providerLatency: number;
  toolLatency: number;
  tokenUsage: TokenUsage;
  success: boolean;
  failureReason?: string;
  timestamp: Date;
}
