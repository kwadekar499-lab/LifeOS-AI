import { TOKEN_ESTIMATE_FACTOR } from '../constants';

export class TokenEstimator {
  /**
   * Estimate the number of tokens in a given text.
   * Uses a simple character-based estimation (1 token ≈ 4 characters).
   * This is a rough estimate and should be replaced with a proper tokenizer
   * when provider-specific accuracy is needed.
   */
  static estimate(text: string): number {
    if (!text || text.length === 0) {
      return 0;
    }
    return Math.ceil(text.length / TOKEN_ESTIMATE_FACTOR);
  }

  /**
   * Estimate tokens for an array of strings.
   */
  static estimateArray(items: string[]): number {
    if (!items || items.length === 0) {
      return 0;
    }
    return items.reduce((total, item) => total + TokenEstimator.estimate(item), 0);
  }

  /**
   * Get character count for a string.
   */
  static characters(text: string): number {
    if (!text) {
      return 0;
    }
    return text.length;
  }

  /**
   * Get combined character count for an array of strings.
   */
  static charactersArray(items: string[]): number {
    if (!items || items.length === 0) {
      return 0;
    }
    return items.reduce((total, item) => total + item.length, 0);
  }

  /**
   * Format an array of items into a single string with numbered entries.
   */
  static formatArray(items: string[], header?: string): string {
    if (!items || items.length === 0) {
      return '';
    }
    const prefix = header ? `${header}\n` : '';
    const entries = items.map((item, index) => `${index + 1}. ${item}`).join('\n');
    return `${prefix}${entries}`;
  }
}
