import { ESTIMATED_TOKENS_PER_CHAR } from '../constants';

export class ContextTokenEstimator {
  static estimate(text: string): number {
    if (!text || text.length === 0) {
      return 0;
    }
    return Math.ceil(text.length / ESTIMATED_TOKENS_PER_CHAR);
  }

  static estimateTotal(items: { content: string }[]): number {
    if (!items || items.length === 0) {
      return 0;
    }
    return items.reduce((total, item) => total + ContextTokenEstimator.estimate(item.content), 0);
  }
}
