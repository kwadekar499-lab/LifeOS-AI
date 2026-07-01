export const CONTEXT_BUILDER_VERSION = '2.0.0';
export const DEFAULT_TOKEN_BUDGET = 4000;
export const MIN_TOKEN_BUDGET = 500;
export const MAX_TOKEN_BUDGET = 16000;
export const DEFAULT_RETRIEVER_TIMEOUT_MS = 5000;
export const MAX_RETRIEVER_TIMEOUT_MS = 30000;

export const RANKING_WEIGHTS = {
  relevance: 0.5,
  recency: 0.3,
  importance: 0.2,
} as const;

export const ESTIMATED_TOKENS_PER_CHAR = 4;

export const RETRIEVER_NAMES = {
  CONVERSATION: 'conversation',
  MEMORY: 'memory',
  KNOWLEDGE: 'knowledge',
  TASK: 'task',
  JOURNAL: 'journal',
} as const;

export const RETRIEVER_METADATA = {
  CONVERSATION: {
    name: 'ConversationRetriever',
    version: '1.0.0',
    priority: 10,
    enabled: true,
    maxTokens: 1000,
    supportsQuery: true,
    supportsSemantic: false,
    supportsFilters: true,
  },
  MEMORY: {
    name: 'MemoryRetriever',
    version: '1.0.0',
    priority: 20,
    enabled: true,
    maxTokens: 1000,
    supportsQuery: true,
    supportsSemantic: false,
    supportsFilters: true,
  },
  KNOWLEDGE: {
    name: 'KnowledgeRetriever',
    version: '1.0.0',
    priority: 15,
    enabled: true,
    maxTokens: 800,
    supportsQuery: false,
    supportsSemantic: false,
    supportsFilters: false,
  },
  TASK: {
    name: 'TaskRetriever',
    version: '1.0.0',
    priority: 5,
    enabled: true,
    maxTokens: 600,
    supportsQuery: true,
    supportsSemantic: false,
    supportsFilters: true,
  },
  JOURNAL: {
    name: 'JournalRetriever',
    version: '1.0.0',
    priority: 25,
    enabled: true,
    maxTokens: 600,
    supportsQuery: true,
    supportsSemantic: false,
    supportsFilters: true,
  },
} as const;

export const BUDGET_DISTRIBUTION: Record<string, number> = {
  conversation: 0.25,
  memory: 0.25,
  knowledge: 0.15,
  task: 0.15,
  journal: 0.2,
};
