import { RetrieverItem } from './retriever-result.type';

export interface ContextMetadata {
  retrievalTime: number;
  rankingTime: number;
  budgetTime: number;
  itemsRetrieved: number;
  itemsIncluded: number;
  estimatedTokens: number;
  requestId: string;
  conversationId: string;
  retrieversUsed: string[];
  retrieversFailed: string[];
  retrievalTimes: Record<string, number>;
  tokensPerRetriever: Record<string, number>;
  itemsPerRetriever: Record<string, number>;
  duplicatesRemoved: number;
  totalItems: number;
  buildTime: number;
}

export interface ContextObject {
  systemContext: string;
  conversation: RetrieverItem[];
  relevantMemories: RetrieverItem[];
  relevantTasks: RetrieverItem[];
  relevantKnowledge: RetrieverItem[];
  relevantJournalEntries: RetrieverItem[];
  metadata: ContextMetadata;
}

export interface RankedContextItem extends RetrieverItem {
  combinedScore: number;
}

export interface ContextSourceMap {
  [source: string]: RetrieverItem[];
}
