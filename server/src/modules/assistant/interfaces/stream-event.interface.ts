export interface StreamEvent {
  type: 'started' | 'token' | 'completed' | 'failed' | 'cancelled';
  data: {
    messageId?: string;
    conversationId?: string;
    token?: string;
    error?: string;
    metadata?: Record<string, unknown>;
  };
  timestamp: Date;
}
