export const JOURNAL_RANKING_WEIGHTS = {
  KEYWORD_MATCH: 0.4,
  RECENCY: 0.4,
  IMPORTANCE: 0.2,
} as const;

export const JOURNAL_DEFAULTS = {
  LIMIT: 20,
  MAX_TITLE_LENGTH: 200,
} as const;
