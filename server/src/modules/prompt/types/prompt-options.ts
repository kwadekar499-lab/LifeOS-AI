export interface PromptBuilderOptions {
  readonly version?: string;
  readonly maxTokens?: number;
  readonly includeMetadata?: boolean;
}

export const DEFAULT_PROMPT_OPTIONS: PromptBuilderOptions = {
  version: '1.0.0',
  includeMetadata: true,
};
