export const KNOWLEDGE_DEFAULTS = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_CATEGORY: 'general',
  MIN_IMPORTANCE: 1,
  MAX_IMPORTANCE: 10,
  DEFAULT_SOURCE: 'manual',
} as const;

export const KNOWLEDGE_RANKING_WEIGHTS = {
  KEYWORD_MATCH: 0.5,
  CATEGORY_MATCH: 0.2,
  RECENCY: 0.2,
  IMPORTANCE: 0.1,
} as const;

export const KNOWLEDGE_EVENTS = {
  CREATED: 'knowledge.created',
  UPDATED: 'knowledge.updated',
  DELETED: 'knowledge.deleted',
  RESTORED: 'knowledge.restored',
} as const;
