import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  AssistantOrchestrator,
  ProcessRequestParams,
  RecoveryParams,
  AssistantResponse,
} from '../interfaces/assistant-orchestrator.interface';
import { IntentClassifier } from './intent-classifier.service';
import { ContextBuilderService } from '../../../context/services/context-builder.service';
import { PromptBuilderService } from '../../../prompt/services/prompt-builder.service';
import { AiGatewayService } from '../../../ai/services/ai-gateway.service';
import { ConversationService } from '../../../conversations/services/conversation.service';
import { MessageService } from '../../../conversations/services/message.service';
import { BuildContextDto } from '../../../context/dto/build-context.dto';
import { AiRequestDto } from '../../../ai/dto/ai-request.dto';
import { MessageStatus } from '../../../conversations/enums/message-status.enum';

@Injectable()
export class AssistantOrchestratorService implements AssistantOrchestrator {
  private readonly logger = new Logger(AssistantOrchestratorService.name);

  constructor(
    private readonly intentClassifier: IntentClassifier,
    private readonly contextBuilder: ContextBuilderService,
    private readonly promptBuilder: PromptBuilderService,
    private readonly aiGateway: AiGatewayService,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService
  ) {}

  async processRequest(params: ProcessRequestParams): Promise<AssistantResponse> {
    const startTime = Date.now();
    const requestId = params.requestId;

    try {
      this.logger.log({
        msg: 'Processing assistant request',
        requestId,
        userId: params.userId,
        conversationId: params.conversationId,
      });

      const intent = this.intentClassifier.classify(params.message);

      let context: any = null;
      try {
        context = await this.buildAssistantContext(params, intent);
      } catch (err) {
        this.logger.warn({ msg: 'Context build failed', requestId, error: String(err) });
      }

      let prompt: any;
      try {
        prompt = this.buildPrompt(params, context, intent);
      } catch (err) {
        this.logger.warn({ msg: 'Prompt build failed', requestId, error: String(err) });
        prompt = this.promptBuilder.buildWithDefaults({
          requestId: params.requestId,
          conversationId: params.conversationId,
          userPrompt: params.message,
        });
      }

      const aiRequestDto: AiRequestDto = {
        prompt: prompt.result,
        provider: params.provider,
        model: params.model,
        temperature: 0.7,
        maxTokens: 1024,
        requestId,
        messages: context?.conversationHistory || [],
      };

      const aiResponse = await this.aiGateway.generate(aiRequestDto);

      let conversationId = params.conversationId || uuidv4();
      const result = await this.persistConversation(
        conversationId,
        params.userId,
        params.message,
        aiResponse.content,
        params.provider || 'mock',
        params.model || 'default'
      );

      if (result.conversationId) {
        conversationId = result.conversationId;
      }

      const totalLatency = Date.now() - startTime;
      return this.buildResponse(
        result.conversationId,
        result.assistantMessageId,
        aiResponse.content,
        intent,
        params.provider || 'mock',
        params.model || 'default',
        { promptTokens: 0, completionTokens: aiResponse.tokenCount || 0, totalTokens: aiResponse.tokenCount || 0 },
        totalLatency,
        0,
        0,
        0,
        0,
        requestId,
        params.userId
      );
    } catch (error) {
      const totalLatency = Date.now() - startTime;
      this.logger.error({
        msg: 'Assistant request failed',
        requestId,
        userId: params.userId,
        error: error instanceof Error ? error.message : String(error),
        totalLatency,
      });
      throw error;
    }
  }

  async processStreamingRequest(params: ProcessRequestParams): Promise<AssistantResponse> {
    this.logger.warn('Streaming fallback to non-streaming');
    return this.processRequest(params);
  }

  async recoverFromFailure(params: RecoveryParams): Promise<AssistantResponse> {
    this.logger.warn({ msg: 'Recovery attempt', requestId: params.requestId, failedAt: params.failedAt });
    return this.processRequest({
      ...params.originalParams,
      requestId: `${params.requestId}-retry`,
    });
  }

  private async buildAssistantContext(params: ProcessRequestParams, _intent: string): Promise<any> {
    const sources = this.intentClassifier.determineRequiredSources(_intent as any);
    const buildContextDto: BuildContextDto = {
      requestId: params.requestId,
      conversationId: params.conversationId || '',
      userId: params.userId,
      query: params.message,
      tokenBudget: 2000,
      includeSources: sources,
      excludeSources: [],
    };
    return this.contextBuilder.buildContext(buildContextDto);
  }

  private buildPrompt(params: ProcessRequestParams, context: any, _intent: string): any {
    return this.promptBuilder.buildWithDefaults({
      requestId: params.requestId,
      conversationId: params.conversationId,
      userPrompt: params.message,
      conversationHistory: context?.conversationHistory || [],
      relevantMemories: context?.memories || [],
      relevantTasks: context?.tasks || [],
      relevantKnowledge: context?.knowledge || [],
    });
  }

  private async persistConversation(
    conversationId: string,
    userId: string,
    userMessage: string,
    assistantMessage: string,
    provider: string,
    model: string
  ): Promise<{ conversationId: string; assistantMessageId: string }> {
    let conversation;
    try {
      conversation = await this.conversationService.findById(conversationId, userId);
    } catch {
      conversation = await this.conversationService.create(userId, {
        title: userMessage.substring(0, 50),
      });
    }

    if (!conversation) {
      const fallbackId = `conv-${Date.now()}`;
      this.logger.warn({ msg: 'Conversation not found, using fallback id', fallbackId });
      return { conversationId: fallbackId, assistantMessageId: `msg-${Date.now()}` };
    }

    await this.messageService.create(conversation.id, userId, {
      content: userMessage,
      role: 'user',
      status: MessageStatus.COMPLETED,
    });

    const assistantMsg = await this.messageService.create(conversation.id, userId, {
      content: assistantMessage,
      role: 'assistant',
      status: MessageStatus.COMPLETED,
      metadata: {
        provider,
        model,
        toolExecutions: [],
      },
    });

    return { conversationId: conversation.id, assistantMessageId: assistantMsg.id };
  }

  private buildResponse(
    conversationId: string,
    messageId: string,
    response: string,
    intent: string,
    provider: string,
    model: string,
    usage: { promptTokens: number; completionTokens: number; totalTokens: number },
    totalLatency: number,
    contextBuildTime: number,
    promptBuildTime: number,
    providerLatency: number,
    toolLatency: number,
    requestId: string,
    userId: string
  ): AssistantResponse {
    return {
      conversationId,
      messageId,
      response,
      intent: intent as any,
      provider,
      model,
      usage,
      latency: {
        totalLatency,
        contextBuildTime,
        promptBuildTime,
        providerLatency,
        toolLatency,
      },
      metadata: {
        requestId,
        conversationId,
        userId,
        timestamp: new Date(),
        provider,
        model,
        toolsExecuted: [],
        streaming: false,
      },
    };
  }
}
