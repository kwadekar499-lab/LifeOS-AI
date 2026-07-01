import { PromptMetadata } from './prompt-metadata.interface';
import { PromptStatistics } from './prompt-statistics.interface';

export interface PromptResult {
  readonly prompt: string;
  readonly metadata: PromptMetadata;
  readonly statistics: PromptStatistics;
}
