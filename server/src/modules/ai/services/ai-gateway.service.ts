import { Injectable, Inject, Logger } from '@nestjs/common';
import { AiRequestDto, ValidatedAiRequest } from '../dto/ai-request.dto';
import { AiResponseDto } from '../dto/ai-response.dto';
import { StreamChunkDto } from '../dto/stream-chunk.dto';
import { ProviderRegistry } from '../registry/provider-registry';
import { AI_GATEWAY_CONFIG, AiGatewayConfig } from '../config/ai-config';
import { AiGatewayException, AiGenerationException } from '../exceptions/ai.exception';
import { ProviderHealthStatus } from '../types/provider-health.type';

@Injectable()
export class AiGatewayService {
  private readonly logger = new Logger(AiGatewayService.name);

  constructor(
    private readonly registry: ProviderRegistry,
    @Inject(AI_GATEWAY_CONFIG) private readonly config: AiGatewayConfig
  ) {}

  async generate(request: AiRequestDto): Promise<AiResponseDto> {
    const validatedRequest = this.validateRequest(request);
    const provider = this.registry.getProvider(validatedRequest.provider);
    const startTime = Date.now();

    this.logger.log({
      message: 'AI Gateway generate request',
      requestId: validatedRequest.requestId,
      provider: validatedRequest.provider,
      model: validatedRequest.model,
    });

    try {
      const response = await provider.generate({
        ...validatedRequest,
        model: this.resolveModel(validatedRequest.provider, validatedRequest.model),
      });

      this.logger.log({
        message: 'AI Gateway generate success',
        requestId: validatedRequest.requestId,
        provider: validatedRequest.provider,
        latency: response.latency,
      });

      return response;
    } catch (error) {
      const latency = Date.now() - startTime;

      this.logger.error({
        message: 'AI Gateway generate failed',
        requestId: validatedRequest.requestId,
        provider: validatedRequest.provider,
        latency,
        error: error instanceof Error ? error.message : String(error),
      });

      if (error instanceof AiGatewayException) {
        throw error;
      }

      throw new AiGenerationException(
        `Generation failed for provider '${validatedRequest.provider}'`,
        validatedRequest.provider,
        validatedRequest.requestId,
        error
      );
    }
  }

  async stream(
    request: AiRequestDto,
    onChunk: (chunk: StreamChunkDto) => void,
    onComplete: (response: AiResponseDto) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    const validatedRequest = this.validateRequest(request);
    const provider = this.registry.getProvider(validatedRequest.provider);

    if (!provider.supportsStreaming()) {
      const error = new AiGatewayException(
        `Provider '${validatedRequest.provider}' does not support streaming`,
        'STREAMING_NOT_SUPPORTED',
        validatedRequest.provider,
        validatedRequest.requestId
      );
      onError(error);
      return;
    }

    this.logger.log({
      message: 'AI Gateway stream request',
      requestId: validatedRequest.requestId,
      provider: validatedRequest.provider,
      model: validatedRequest.model,
    });

    try {
      await provider.stream(
        {
          ...validatedRequest,
          model: this.resolveModel(validatedRequest.provider, validatedRequest.model),
        },
        (chunk) => {
          onChunk(chunk);
        },
        (response) => {
          this.logger.log({
            message: 'AI Gateway stream completed',
            requestId: validatedRequest.requestId,
            provider: validatedRequest.provider,
            latency: response.latency,
          });
          onComplete(response);
        },
        (error) => {
          this.logger.error({
            message: 'AI Gateway stream error',
            requestId: validatedRequest.requestId,
            provider: validatedRequest.provider,
            error: error.message,
          });
          onError(error);
        }
      );
    } catch (error) {
      this.logger.error({
        message: 'AI Gateway stream unexpected error',
        requestId: validatedRequest.requestId,
        provider: validatedRequest.provider,
        error: error instanceof Error ? error.message : String(error),
      });
      onError(error instanceof Error ? error : new Error(`Stream error: ${String(error)}`));
    }
  }

  async health(): Promise<Record<string, ProviderHealthStatus>> {
    const providers = this.registry.listProviders();
    const healthMap: Record<string, ProviderHealthStatus> = {};

    for (const provider of providers) {
      try {
        const health = await provider.health();
        healthMap[provider.name] = health;
      } catch (error) {
        this.logger.warn({
          message: `Health check failed for provider '${provider.name}'`,
          error: error instanceof Error ? error.message : String(error),
        });
        healthMap[provider.name] = {
          provider: provider.name,
          status: 'unhealthy',
          latency: 0,
          availableModels: [],
          streamingSupported: provider.supportsStreaming(),
        };
      }
    }

    return healthMap;
  }

  listProviders(): string[] {
    return this.registry.listProviderNames();
  }

  getDefaultProvider(): string {
    return this.registry.defaultProvider;
  }

  private validateRequest(request: AiRequestDto): ValidatedAiRequest {
    if (!request.prompt || request.prompt.trim().length === 0) {
      throw new AiGatewayException('Prompt is required', 'VALIDATION_ERROR', undefined, request.requestId);
    }

    return {
      provider: request.provider || this.config.defaultProvider,
      model: request.model || 'default',
      prompt: request.prompt,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      maxTokens: request.maxTokens ?? 1024,
      stream: request.stream ?? this.config.streamingEnabled,
      options: request.options,
      requestId: request.requestId || `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };
  }

  private resolveModel(provider: string, model: string): string {
    if (this.config.modelOverrides && this.config.modelOverrides[provider]) {
      return this.config.modelOverrides[provider];
    }
    return model;
  }
}
