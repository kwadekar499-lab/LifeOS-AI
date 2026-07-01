import { Inject, Injectable, Logger } from '@nestjs/common';
import { BaseRetriever } from './base-retriever';
import { RetrieverResult, RetrieverItem } from '../types/retriever-result.type';
import { RetrieverMetadata } from '../interfaces/retriever.interface';
import { ContextSource } from '../types/context-source.type';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TaskRetriever extends BaseRetriever {
  readonly source: ContextSource = 'task';
  readonly metadata: RetrieverMetadata = {
    name: 'TaskRetriever',
    version: '1.0.0',
    priority: 5,
    enabled: true,
    maxTokens: 600,
    supportsQuery: true,
    supportsSemantic: false,
    supportsFilters: true,
  };

  private readonly logger = new Logger(TaskRetriever.name);

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    super();
  }

  async retrieve(requestId: string, conversationId: string, userId: string, query: string): Promise<RetrieverResult> {
    const startTime = Date.now();
    const tasks = await this.findRelevant(userId, query, 10);

    const items: RetrieverItem[] = tasks.map((task: any) => {
      const scores = this.computeScores(task, query);
      return {
        id: task.id,
        content: this.formatTaskContent(task),
        source: this.source,
        relevanceScore: scores.relevance,
        recencyScore: scores.recency,
        importanceScore: scores.importance,
        createdAt: task.createdAt,
        metadata: {
          title: task.title,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate?.toISOString() ?? null,
          completedAt: task.completedAt?.toISOString() ?? null,
          labels: task.labels,
          isOverdue: this.isOverdue(task),
          isUpcoming: this.isUpcoming(task),
        },
      };
    });

    const retrievalTimeMs = Date.now() - startTime;

    return {
      source: this.source,
      items,
      totalItems: items.length,
      retrievalTimeMs,
    };
  }

  async findRelevant(userId: string, query: string, limit: number = 10): Promise<any[]> {
    const tasks = await this.prisma.task.findMany({
      where: { userId },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      take: limit * 2,
    });

    const ranked = tasks
      .map((task: any) => ({
        task,
        score: this.computeCompositeScore(task, query),
      }))
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      .slice(0, limit)
      .map((item: { task: any }) => item.task);

    return ranked;
  }

  private computeScores(task: any, query: string): { relevance: number; recency: number; importance: number } {
    const priorityWeights: Record<string, number> = {
      urgent: 1.0,
      high: 0.8,
      medium: 0.5,
      low: 0.2,
    };

    const priorityScore = priorityWeights[task.priority] ?? 0.3;
    let importance = priorityScore * 10;

    if (this.isOverdue(task)) {
      importance += 3;
    }
    if (this.isUpcoming(task)) {
      importance += 1;
    }
    importance = Math.min(importance, 10);

    let relevance = priorityScore;
    if (query && query.length > 0) {
      const lowerQuery = query.toLowerCase();
      const titleMatch = task.title?.toLowerCase().includes(lowerQuery) ? 0.3 : 0;
      const descMatch = task.description?.toLowerCase().includes(lowerQuery) ? 0.15 : 0;
      relevance += titleMatch + descMatch;
    }
    if (this.isOverdue(task)) {
      relevance += 0.15;
    }
    relevance = Math.min(relevance, 1.0);

    const ageMs = Date.now() - task.createdAt.getTime();
    const maxAgeMs = 90 * 24 * 60 * 60 * 1000;
    const recency = Math.max(0, 1 - ageMs / maxAgeMs);

    return { relevance, recency, importance };
  }

  private computeCompositeScore(task: any, query: string): number {
    const priorityWeights: Record<string, number> = {
      urgent: 1.0,
      high: 0.8,
      medium: 0.5,
      low: 0.2,
    };

    const priorityScore = (priorityWeights[task.priority] ?? 0.3) * 0.4;
    let dueDateScore = 0.3;

    if (task.dueDate) {
      const dueMs = task.dueDate.getTime();
      const nowMs = Date.now();
      const diffDays = (dueMs - nowMs) / (1000 * 60 * 60 * 24);

      if (diffDays < 0) {
        dueDateScore = 0.3 + Math.min(0.15, Math.abs(diffDays) * 0.02);
      } else if (diffDays <= 1) {
        dueDateScore = 0.27;
      } else if (diffDays <= 3) {
        dueDateScore = 0.24;
      } else if (diffDays <= 7) {
        dueDateScore = 0.18;
      } else {
        dueDateScore = 0.12;
      }
    }
    dueDateScore = Math.min(dueDateScore, 0.3);

    let keywordScore = 0.2;
    if (query && query.length > 0) {
      const lowerQuery = query.toLowerCase();
      const titleMatch = task.title?.toLowerCase().includes(lowerQuery) ?? false;
      const descMatch = task.description?.toLowerCase().includes(lowerQuery) ?? false;

      if (titleMatch) keywordScore = 0.2;
      else if (descMatch) keywordScore = 0.1;
      else keywordScore = 0.05;
    }

    const ageMs = Date.now() - task.createdAt.getTime();
    const maxAgeMs = 90 * 24 * 60 * 60 * 1000;
    const recencyScore = Math.max(0, 1 - ageMs / maxAgeMs) * 0.1;

    let score = priorityScore + dueDateScore + keywordScore + recencyScore;

    if (this.isOverdue(task)) {
      score += 0.15;
    }

    return score;
  }

  private isOverdue(task: any): boolean {
    if (!task.dueDate || task.status === 'completed') {
      return false;
    }
    return task.dueDate.getTime() < Date.now();
  }

  private isUpcoming(task: any): boolean {
    if (!task.dueDate || task.status === 'completed') {
      return false;
    }
    const nowMs = Date.now();
    const diffMs = task.dueDate.getTime() - nowMs;
    return diffMs > 0 && diffMs <= 7 * 24 * 60 * 60 * 1000;
  }

  private formatTaskContent(task: any): string {
    const priority = task.priority?.toUpperCase() ?? 'MEDIUM';
    const status = task.status === 'completed' ? '\u2705' : '\uD83D\uDCCB';
    const overdue = this.isOverdue(task) ? ' [OVERDUE]' : '';
    const dueStr = task.dueDate
      ? ` | Due: ${task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      : '';
    const descStr = task.description ? `\n   ${task.description}` : '';

    return `${status} [${priority}]${overdue} ${task.title}${dueStr}${descStr}`;
  }
}
