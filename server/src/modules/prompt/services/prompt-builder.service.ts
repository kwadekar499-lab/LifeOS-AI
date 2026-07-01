import { Injectable, Logger } from '@nestjs/common';
import { PromptBuilder } from '../builders/prompt-builder';
import { PromptContext, PromptResult } from '../interfaces';
import { BuildPromptDto } from '../dto/build-prompt.dto';
import { SYSTEM_TEMPLATE, ASSISTANT_IDENTITY_TEMPLATE, OUTPUT_INSTRUCTIONS_TEMPLATE } from '../templates';

@Injectable()
export class PromptBuilderService {
  private readonly logger = new Logger(PromptBuilderService.name);

  buildFromDto(dto: BuildPromptDto): PromptResult {
    const builder = new PromptBuilder();
    const context = this.dtoToContext(dto);
    const result = builder.build(context);

    this.logger.log({
      msg: 'Prompt built from DTO',
      requestId: dto.requestId || 'unknown',
      conversationId: dto.conversationId || 'unknown',
      promptSize: result.metadata.characterCount,
      tokenEstimate: result.metadata.estimatedTokens,
      sectionsIncluded: result.metadata.sectionsIncluded.length,
    });

    return result;
  }

  buildFromContext(context: PromptContext): PromptResult {
    const builder = new PromptBuilder();
    const result = builder.build(context);

    this.logger.log({
      msg: 'Prompt built from context',
      requestId: context.requestId || 'unknown',
      conversationId: context.conversationId || 'unknown',
      promptSize: result.metadata.characterCount,
      tokenEstimate: result.metadata.estimatedTokens,
      sectionsIncluded: result.metadata.sectionsIncluded.length,
    });

    return result;
  }

  buildWithDefaults(context: Partial<PromptContext>): PromptResult {
    const fullContext: PromptContext = {
      ...context,
      systemPrompt: context.systemPrompt || SYSTEM_TEMPLATE,
      assistantIdentity: context.assistantIdentity || ASSISTANT_IDENTITY_TEMPLATE,
      outputInstructions: context.outputInstructions || OUTPUT_INSTRUCTIONS_TEMPLATE,
    };

    return this.buildFromContext(fullContext);
  }

  private dtoToContext(dto: BuildPromptDto): PromptContext {
    return {
      systemPrompt: dto.systemPrompt,
      assistantIdentity: dto.assistantIdentity,
      userProfile: dto.userProfile,
      conversationSummary: dto.conversationSummary,
      conversationHistory: dto.conversationHistory,
      relevantMemories: dto.relevantMemories,
      relevantTasks: dto.relevantTasks,
      relevantKnowledge: dto.relevantKnowledge,
      activeProject: dto.activeProject,
      userPrompt: dto.userPrompt,
      outputInstructions: dto.outputInstructions,
      requestId: dto.requestId,
      conversationId: dto.conversationId,
    };
  }
}
