import { Injectable, Logger } from '@nestjs/common';
import { RankedContextItem } from '../types/context-object.type';
import { ESTIMATED_TOKENS_PER_CHAR, DEFAULT_TOKEN_BUDGET, BUDGET_DISTRIBUTION } from '../constants';

@Injectable()
export class BudgetManagerService {
  private readonly logger = new Logger(BudgetManagerService.name);

  applyBudget(rankedItems: RankedContextItem[], tokenBudget: number = DEFAULT_TOKEN_BUDGET): RankedContextItem[] {
    if (rankedItems.length === 0 || tokenBudget <= 0) {
      return [];
    }

    const perSourceBudgets = this.calculatePerSourceBudgets(rankedItems, tokenBudget);
    const included: RankedContextItem[] = [];
    const usedTokensBySource: Record<string, number> = {};
    let totalUsedTokens = 0;

    for (const item of rankedItems) {
      const source = item.source;
      const maxTokensForSource = perSourceBudgets[source] ?? 0;
      const usedInSource = usedTokensBySource[source] ?? 0;
      const itemTokens = Math.ceil(item.content.length / ESTIMATED_TOKENS_PER_CHAR);

      if (usedInSource + itemTokens <= maxTokensForSource && totalUsedTokens + itemTokens <= tokenBudget) {
        included.push(item);
        usedTokensBySource[source] = usedInSource + itemTokens;
        totalUsedTokens += itemTokens;
      }
    }

    this.logger.log(
      {
        totalItems: rankedItems.length,
        includedItems: included.length,
        usedTokens: totalUsedTokens,
        tokenBudget,
        usedTokensBySource,
      },
      'Budget applied with per-source distribution'
    );

    return included;
  }

  getBudgetDistribution(): Record<string, number> {
    return { ...BUDGET_DISTRIBUTION };
  }

  private calculatePerSourceBudgets(items: RankedContextItem[], totalBudget: number): Record<string, number> {
    const sourceCounts: Record<string, number> = {};
    for (const item of items) {
      sourceCounts[item.source] = (sourceCounts[item.source] ?? 0) + 1;
    }

    const sources = Object.keys(sourceCounts);
    if (sources.length === 0) return {};

    const budgets: Record<string, number> = {};
    let unallocatedBudget = totalBudget;
    let unallocatedSources = 0;

    for (const source of sources) {
      const distribution = BUDGET_DISTRIBUTION[source];
      if (distribution) {
        const allocated = Math.floor(totalBudget * distribution);
        budgets[source] = allocated;
        unallocatedBudget -= allocated;
      } else {
        unallocatedSources++;
      }
    }

    // Redistribute unused budget proportionally
    if (unallocatedBudget > 0 && unallocatedSources > 0) {
      const perSource = Math.floor(unallocatedBudget / unallocatedSources);
      for (const source of sources) {
        if (!budgets[source]) {
          budgets[source] = perSource;
        }
      }
    }

    // Ensure minimum allocation per source
    for (const source of sources) {
      if (!budgets[source] || budgets[source] <= 0) {
        budgets[source] = Math.floor(totalBudget / sources.length);
      }
    }

    return budgets;
  }
}
