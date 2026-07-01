export const RAG_DEFAULT_MAX_ITEMS = 20;
export const RAG_DEFAULT_TOKEN_BUDGET = 3000;
export const RAG_RANKING_WEIGHTS = {
  relevance: 0.4,
  recency: 0.3,
  importance: 0.3,
};
export const RAG_MERGE_PRIORITY: Record<string, number> = {
  semantic: 0,
  memory: 1,
  knowledge: 2,
  journal: 3,
  conversation: 4,
  task: 5,
};
