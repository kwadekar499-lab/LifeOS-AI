import { Injectable, Logger } from '@nestjs/common';
import {
  PromptSection,
  PromptContext,
  PromptResult,
  PromptMetadata,
  PromptStatistics,
  PromptBuilderInterface,
} from '../interfaces';
import { PromptSectionType, PROMPT_SECTION_ORDER, PromptBuilderOptions, DEFAULT_PROMPT_OPTIONS } from '../types';
import { TokenEstimator } from '../utils/token-estimator';
import { DEFAULT_SECTION_SEPARATOR, SECTION_HEADERS, PROMPT_BUILDER_VERSION } from '../constants';

@Injectable()
export class PromptBuilder implements PromptBuilderInterface {
  private readonly logger = new Logger(PromptBuilder.name);
  private sections: Map<PromptSectionType, string> = new Map();
  private readonly options: PromptBuilderOptions;

  constructor(options: PromptBuilderOptions = {}) {
    this.options = { ...DEFAULT_PROMPT_OPTIONS, ...options };
  }

  addSystemPrompt(systemPrompt: string): PromptBuilderInterface {
    if (systemPrompt?.trim()) {
      this.sections.set(PromptSectionType.SYSTEM_PROMPT, systemPrompt.trim());
    }
    return this;
  }

  addAssistantIdentity(identity: string): PromptBuilderInterface {
    if (identity?.trim()) {
      this.sections.set(PromptSectionType.ASSISTANT_IDENTITY, identity.trim());
    }
    return this;
  }

  addUserProfile(profile: string): PromptBuilderInterface {
    if (profile?.trim()) {
      this.sections.set(PromptSectionType.USER_PROFILE, profile.trim());
    }
    return this;
  }

  addConversationSummary(summary: string): PromptBuilderInterface {
    if (summary?.trim()) {
      this.sections.set(PromptSectionType.CONVERSATION_SUMMARY, summary.trim());
    }
    return this;
  }

  addConversationHistory(history: string[]): PromptBuilderInterface {
    if (history && history.length > 0) {
      const formatted = TokenEstimator.formatArray(history, 'Previous messages:');
      this.sections.set(PromptSectionType.CONVERSATION_HISTORY, formatted);
    }
    return this;
  }

  addMemories(memories: string[]): PromptBuilderInterface {
    if (memories && memories.length > 0) {
      const formatted = TokenEstimator.formatArray(memories, 'Relevant memories from your life:');
      this.sections.set(PromptSectionType.RELEVANT_MEMORIES, formatted);
    }
    return this;
  }

  addTasks(tasks: string[]): PromptBuilderInterface {
    if (tasks && tasks.length > 0) {
      const formatted = TokenEstimator.formatArray(tasks, 'Active tasks and to-dos:');
      this.sections.set(PromptSectionType.RELEVANT_TASKS, formatted);
    }
    return this;
  }

  addKnowledge(knowledge: string[]): PromptBuilderInterface {
    if (knowledge && knowledge.length > 0) {
      const formatted = TokenEstimator.formatArray(knowledge, 'Knowledge base entries:');
      this.sections.set(PromptSectionType.RELEVANT_KNOWLEDGE, formatted);
    }
    return this;
  }

  addActiveProject(project: string): PromptBuilderInterface {
    if (project?.trim()) {
      this.sections.set(PromptSectionType.ACTIVE_PROJECT, project.trim());
    }
    return this;
  }

  addUserPrompt(userPrompt: string): PromptBuilderInterface {
    if (userPrompt?.trim()) {
      this.sections.set(PromptSectionType.USER_PROMPT, userPrompt.trim());
    }
    return this;
  }

  addOutputInstructions(instructions: string): PromptBuilderInterface {
    if (instructions?.trim()) {
      this.sections.set(PromptSectionType.OUTPUT_INSTRUCTIONS, instructions.trim());
    }
    return this;
  }

  build(context?: PromptContext): PromptResult {
    const startTime = Date.now();

    if (context) {
      this.applyContext(context);
    }

    const orderedSections = this.getOrderedSections();
    const sectionsIncluded = orderedSections.map((s) => s.name);
    const promptParts: string[] = [];

    for (const section of orderedSections) {
      const header = SECTION_HEADERS[section.name];
      if (header) {
        promptParts.push(`### ${header}`);
      }
      promptParts.push(section.content);
    }

    const prompt = promptParts.join(DEFAULT_SECTION_SEPARATOR);
    const characterCount = prompt.length;
    const estimatedTokens = TokenEstimator.estimate(prompt);
    const buildTime = Date.now() - startTime;

    const metadata: PromptMetadata = {
      estimatedTokens,
      characterCount,
      sectionsIncluded,
      buildTime,
      version: this.options.version || PROMPT_BUILDER_VERSION,
    };

    const statistics: PromptStatistics = {
      totalSections: orderedSections.length,
      totalCharacters: characterCount,
      totalEstimatedTokens: estimatedTokens,
      sections: orderedSections.map((s) => ({
        name: s.name,
        order: s.order,
        characters: s.characterCount,
        estimatedTokens: s.tokenEstimate,
      })),
    };

    this.logger.log({
      msg: 'Prompt built successfully',
      requestId: context?.requestId || 'unknown',
      conversationId: context?.conversationId || 'unknown',
      promptSize: characterCount,
      tokenEstimate: estimatedTokens,
      buildTime,
      sectionsIncluded: sectionsIncluded.length,
    });

    return {
      prompt,
      metadata,
      statistics,
    };
  }

  reset(): void {
    this.sections.clear();
  }

  private applyContext(context: PromptContext): void {
    this.addSystemPrompt(context.systemPrompt || '');
    this.addAssistantIdentity(context.assistantIdentity || '');
    this.addUserProfile(context.userProfile || '');
    this.addConversationSummary(context.conversationSummary || '');
    this.addConversationHistory(context.conversationHistory || []);
    this.addMemories(context.relevantMemories || []);
    this.addTasks(context.relevantTasks || []);
    this.addKnowledge(context.relevantKnowledge || []);
    this.addActiveProject(context.activeProject || '');
    this.addUserPrompt(context.userPrompt || '');
    this.addOutputInstructions(context.outputInstructions || '');
  }

  private getOrderedSections(): PromptSection[] {
    const sections: PromptSection[] = [];

    for (const [type, content] of this.sections.entries()) {
      const order = PROMPT_SECTION_ORDER[type] ?? 99;
      sections.push({
        name: type,
        content,
        order,
        tokenEstimate: TokenEstimator.estimate(content),
        characterCount: content.length,
      });
    }

    sections.sort((a, b) => a.order - b.order);
    return sections;
  }
}
