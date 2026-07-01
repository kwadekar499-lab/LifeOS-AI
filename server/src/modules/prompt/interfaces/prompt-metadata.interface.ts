export interface PromptMetadata {
  readonly estimatedTokens: number;
  readonly characterCount: number;
  readonly sectionsIncluded: string[];
  readonly buildTime: number;
  readonly version: string;
}
