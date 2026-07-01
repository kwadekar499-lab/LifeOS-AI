import { Module, Global } from '@nestjs/common';
import { ContextBuilder } from './builders/context-builder';
import { ContextBuilderService } from './services/context-builder.service';
import { RetrieverRegistry } from './registry/retriever.registry';
import { RankingService } from './ranking/ranking.service';
import { BudgetManagerService } from './budget/budget-manager.service';
import {
  ConversationRetriever,
  MemoryRetriever,
  KnowledgeRetriever,
  TaskRetriever,
  JournalRetriever,
} from './retrievers';
import { ConversationsModule } from '../conversations/conversations.module';

@Global()
@Module({
  imports: [ConversationsModule],
  providers: [
    // Registry
    RetrieverRegistry,

    // Ranking & Budget
    RankingService,
    BudgetManagerService,

    // Builder
    ContextBuilder,

    // Service
    ContextBuilderService,

    // Production Retrievers
    ConversationRetriever,
    MemoryRetriever,
    KnowledgeRetriever,
    TaskRetriever,
    JournalRetriever,
  ],
  exports: [ContextBuilderService, RetrieverRegistry, RankingService, BudgetManagerService],
})
export class ContextModule {
  constructor(
    private readonly registry: RetrieverRegistry,
    private readonly conversationRetriever: ConversationRetriever,
    private readonly memoryRetriever: MemoryRetriever,
    private readonly knowledgeRetriever: KnowledgeRetriever,
    private readonly taskRetriever: TaskRetriever,
    private readonly journalRetriever: JournalRetriever
  ) {
    this.registry.register(this.conversationRetriever);
    this.registry.register(this.memoryRetriever);
    this.registry.register(this.knowledgeRetriever);
    this.registry.register(this.taskRetriever);
    this.registry.register(this.journalRetriever);
  }
}
