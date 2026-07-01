export interface PromptStatistics {
  readonly totalSections: number;
  readonly totalCharacters: number;
  readonly totalEstimatedTokens: number;
  readonly sections: Array<{
    name: string;
    order: number;
    characters: number;
    estimatedTokens: number;
  }>;
}
