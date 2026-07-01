export interface KnowledgeCreatedEvent {
  type: 'knowledge.created';
  knowledgeId: string;
  userId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeUpdatedEvent {
  type: 'knowledge.updated';
  knowledgeId: string;
  userId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeDeletedEvent {
  type: 'knowledge.deleted';
  knowledgeId: string;
  userId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeRestoredEvent {
  type: 'knowledge.restored';
  knowledgeId: string;
  userId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export type KnowledgeEvent =
  | KnowledgeCreatedEvent
  | KnowledgeUpdatedEvent
  | KnowledgeDeletedEvent
  | KnowledgeRestoredEvent;
