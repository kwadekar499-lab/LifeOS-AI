export interface ContextRequest {
  requestId: string;
  conversationId: string;
  userId: string;
  query: string;
  tokenBudget?: number;
  includeSources?: string[];
  excludeSources?: string[];
}
