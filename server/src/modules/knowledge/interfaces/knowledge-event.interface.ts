export interface KnowledgeEvent {
  type: string;
  knowledgeId: string;
  userId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}
