export enum ConversationEventType {
  CREATED = 'conversation.created',
  UPDATED = 'conversation.updated',
  ARCHIVED = 'conversation.archived',
  DELETED = 'conversation.deleted',
  RESTORED = 'conversation.restored',
  PINNED = 'conversation.pinned',
  UNPINNED = 'conversation.unpinned',
}

export enum MessageEventType {
  CREATED = 'message.created',
  UPDATED = 'message.updated',
  DELETED = 'message.deleted',
}

export interface ConversationEvent {
  type: ConversationEventType;
  conversationId: string;
  userId: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}

export interface MessageEvent {
  type: MessageEventType;
  messageId: string;
  conversationId: string;
  userId: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}

export type DomainEvent = ConversationEvent | MessageEvent;
