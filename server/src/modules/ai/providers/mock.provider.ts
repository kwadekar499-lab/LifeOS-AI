import { Injectable, Inject, Logger } from '@nestjs/common';
import { AiProviderInterface } from '../interfaces/ai-provider.interface';
import { AiRequestDto } from '../dto/ai-request.dto';
import { AiResponseDto } from '../dto/ai-response.dto';
import { StreamChunkDto } from '../dto/stream-chunk.dto';
import { ProviderHealthStatus } from '../types/provider-health.type';
import { AI_GATEWAY_CONFIG, AiGatewayConfig } from '../config/ai-config';

@Injectable()
export class MockProvider implements AiProviderInterface {
  readonly name = 'mock';
  private readonly logger = new Logger(MockProvider.name);
  private readonly simulatedLatency: number;

  private readonly MOCK_MODELS = ['mock-gpt-3.5', 'mock-gpt-4', 'mock-claude-3', 'mock-llama-3', 'mock-deepseek'];

  constructor(@Inject(AI_GATEWAY_CONFIG) config: AiGatewayConfig) {
    this.simulatedLatency = Math.min(config.requestTimeout, 100);
  }

  async generate(request: AiRequestDto): Promise<AiResponseDto> {
    const startTime = Date.now();
    const requestId = request.requestId || 'mock-req-unknown';

    this.logger.log(`Mock generate called - prompt: "${request.prompt.substring(0, 50)}..."`);

    await this.simulateDelay();

    return {
      content: `This is a mock response to: "${request.prompt}"`,
      model: request.model || this.MOCK_MODELS[0],
      provider: this.name,
      requestId,
      latency: Date.now() - startTime,
      tokenCount: 42,
      finishReason: 'stop',
      success: true,
    };
  }

  async stream(
    request: AiRequestDto,
    onChunk: (chunk: StreamChunkDto) => void,
    onComplete: (response: AiResponseDto) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    const startTime = Date.now();
    const requestId = request.requestId || 'mock-req-stream-unknown';

    this.logger.log(`Mock stream called - prompt: "${request.prompt.substring(0, 50)}..."`);

    try {
      const words = `This is a streamed mock response to: "${request.prompt}"`.split(' ');
      const totalWords = words.length;

      for (let i = 0; i < totalWords; i++) {
        await this.simulateDelay(20);

        const chunk = new StreamChunkDto();
        chunk.content = i === 0 ? words[i] : ` ${words[i]}`;
        chunk.requestId = requestId;
        chunk.provider = this.name;
        chunk.model = request.model || this.MOCK_MODELS[0];
        chunk.done = i === totalWords - 1;
        chunk.tokenIndex = i;

        onChunk(chunk);
      }

      const response = new AiResponseDto();
      response.content = words.join('');
      response.model = request.model || this.MOCK_MODELS[0];
      response.provider = this.name;
      response.requestId = requestId;
      response.latency = Date.now() - startTime;
      response.tokenCount = totalWords;
      response.finishReason = 'stop';
      response.success = true;

      onComplete(response);
    } catch (error) {
      onError(error instanceof Error ? error : new Error(`Mock stream error: ${String(error)}`));
    }
  }

  async health(): Promise<ProviderHealthStatus> {
    const startTime = Date.now();

    return {
      provider: this.name,
      status: 'healthy',
      latency: Date.now() - startTime,
      availableModels: await this.models(),
      streamingSupported: this.supportsStreaming(),
    };
  }

  async models(): Promise<string[]> {
    return [...this.MOCK_MODELS];
  }

  supportsTools(): boolean {
    return true;
  }

  supportsVision(): boolean {
    return true;
  }

  supportsFiles(): boolean {
    return true;
  }

  supportsStreaming(): boolean {
    return true;
  }

  private async simulateDelay(customMs?: number): Promise<void> {
    const ms = customMs ?? this.simulatedLatency;
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
