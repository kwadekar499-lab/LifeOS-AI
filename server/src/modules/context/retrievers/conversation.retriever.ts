import { Injectable, Logger } from '@nestjs/common';
import { BaseRetriever } from './base-retriever';
import { RetrieverResult, RetrieverItem } from '../types/retriever-result.type';
import { RetrieverMetadata } from '../interfaces/retriever.interface';
import { ContextSource } from '../types/context-source.type';
import { ConversationRepository } from '../../conversations/repositories/conversation.repository';
import { MessageRepository } from '../../conversations/repositories/message.repository';

@Injectable()
export class ConversationRetriever extends BaseRetriever {
  readonly source: ContextSource = 'conversation';
  readonly metadata: RetrieverMetadata = {
    name: 'ConversationRetriever',
    version: '1.0.0',
    priority: 10,
    enabled: true,
    maxTokens: 1000,
    supportsQuery: true,
    supportsSemantic: false,
    supportsFilters: true,
  };

  private readonly logger = new Logger(ConversationRetriever.name);

  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository
  ) {
    super();
  }

  async retrieve(requestId: string, conversationId: string, userId: string, query: string): Promise<RetrieverResult> {
    const startTime = Date.now();

    const items: RetrieverItem[] = [];

    // 1. Get recent conversations for this user
    const recentConversations = await this.conversationRepository.findRecent(userId, 10);
    for (const conversation of recentConversations) {
      const messages = await this.messageRepository.findByConversation(conversation.id, 5);
      if (messages.length === 0) continue;

      const conversationContent = messages
        .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');

      const recencyScore = this.calculateRecencyScore(conversation.lastMessageAt ?? conversation.createdAt);
      const keywordScore = query ? this.calculateKeywordScore(conversationContent, query) : 0.5;
      const importanceScore = conversation.isPinned ? 1.0 : 0.5;
      items.push(
        this.createItem(conversationContent, keywordScore, recencyScore, importanceScore, {
          conversationId: conversation.id,
          messageCount: messages.length,
          isPinned: conversation.isPinned,
          title: conversation.title,
          summary: conversation.summary,
          lastMessage: conversation.lastMessage,
          lastMessageAt: conversation.lastMessageAt,
        })
      );
    }

    // 2. Search messages by keyword
    if (query) {
      const matchedMessages = await this.messageRepository.searchMessages(userId, query, 15);
      for (const message of matchedMessages) {
        const alreadyIncluded = items.some((item) => item.metadata?.conversationId === message.conversationId);
        if (alreadyIncluded) continue;

        const recencyScore = this.calculateRecencyScore(message.createdAt);
        const keywordScore = 0.9;
        const importanceScore = 0.6;

        items.push(
          this.createItem(
            `${message.role === 'user' ? 'User' : 'Assistant'}: ${message.content}`,
            keywordScore,
            recencyScore,
            importanceScore,
            {
              messageId: message.id,
              conversationId: message.conversationId,
              role: message.role,
              messageCount: 1,
            }
          )
        );
      }
    }

    // 3. Get latest assistant replies
    const recentMessages = await this.messageRepository.findRecent(userId, 20);
    const assistantReplies = recentMessages.filter((m) => m.role === 'assistant');
    for (const reply of assistantReplies.slice(0, 5)) {
      if (items.some((item) => item.metadata?.messageId === reply.id)) continue;

      items.push(
        this.createItem(`Assistant: ${reply.content}`, 0.5, this.calculateRecencyScore(reply.createdAt), 0.4, {
          messageId: reply.id,
          conversationId: reply.conversationId,
          role: reply.role,
        })
      );
    }

    // 4. Get latest user prompts
    const userPrompts = recentMessages.filter((m) => m.role === 'user');
    for (const prompt of userPrompts.slice(0, 5)) {
      if (items.some((item) => item.metadata?.messageId === prompt.id)) continue;

      items.push(
        this.createItem(`User: ${prompt.content}`, 0.4, this.calculateRecencyScore(prompt.createdAt), 0.4, {
          messageId: prompt.id,
          conversationId: prompt.conversationId,
          role: prompt.role,
        })
      );
    }

    const retrievalTimeMs = Date.now() - startTime;

    return {
      source: this.source,
      items,
      totalItems: items.length,
      retrievalTimeMs,
    };
  }

  private calculateRecencyScore(date: Date): number {
    const ageMs = Date.now() - date.getTime();
    const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
    return Math.max(0, 1 - ageMs / maxAgeMs);
  }

  private calculateKeywordScore(content: string, query: string): number {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const queryWords = lowerQuery.split(/\s+/).filter(Boolean);

    if (queryWords.length === 0) return 0;

    let matchCount = 0;
    for (const word of queryWords) {
      if (lowerContent.includes(word)) {
        matchCount++;
      }
    }

    return matchCount / queryWords.length;
  }
}
