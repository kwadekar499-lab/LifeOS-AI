export interface PromptContext {
  readonly systemPrompt?: string;
  readonly assistantIdentity?: string;
  readonly userProfile?: string;
  readonly conversationSummary?: string;
  readonly conversationHistory?: string[];
  readonly relevantMemories?: string[];
  readonly relevantTasks?: string[];
  readonly relevantKnowledge?: string[];
  readonly activeProject?: string;
  readonly userPrompt?: string;
  readonly outputInstructions?: string;
  readonly requestId?: string;
  readonly conversationId?: string;
}
