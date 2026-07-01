import { PromptContext } from './prompt-context.interface';
import { PromptResult } from './prompt-result.interface';

export interface PromptBuilderInterface {
  addSystemPrompt(systemPrompt: string): PromptBuilderInterface;
  addAssistantIdentity(identity: string): PromptBuilderInterface;
  addUserProfile(profile: string): PromptBuilderInterface;
  addConversationSummary(summary: string): PromptBuilderInterface;
  addConversationHistory(history: string[]): PromptBuilderInterface;
  addMemories(memories: string[]): PromptBuilderInterface;
  addTasks(tasks: string[]): PromptBuilderInterface;
  addKnowledge(knowledge: string[]): PromptBuilderInterface;
  addActiveProject(project: string): PromptBuilderInterface;
  addUserPrompt(userPrompt: string): PromptBuilderInterface;
  addOutputInstructions(instructions: string): PromptBuilderInterface;
  build(context?: PromptContext): PromptResult;
  reset(): void;
}
