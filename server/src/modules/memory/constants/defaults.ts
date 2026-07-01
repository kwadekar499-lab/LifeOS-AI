export const MEMORY_DEFAULTS = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_IMPORTANCE: 5,
  MIN_IMPORTANCE: 1,
  MAX_IMPORTANCE: 10,
  DEFAULT_SOURCE: 'manual',
  DEFAULT_CATEGORY: 'general',
} as const;

export const MEMORY_RANKING_WEIGHTS = {
  IMPORTANCE: 0.5,
  KEYWORD_MATCH: 0.3,
  RECENCY: 0.2,
} as const;

export const MEMORY_EVENTS = {
  CREATED: 'memory.created',
  UPDATED: 'memory.updated',
  DELETED: 'memory.deleted',
  RESTORED: 'memory.restored',
} as const;
