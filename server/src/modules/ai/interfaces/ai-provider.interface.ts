import { AiRequestDto } from '../dto/ai-request.dto';
import { AiResponseDto } from '../dto/ai-response.dto';
import { StreamChunkDto } from '../dto/stream-chunk.dto';
import { ProviderHealthStatus } from '../types/provider-health.type';

export interface AiProviderInterface {
  readonly name: string;

  generate(request: AiRequestDto): Promise<AiResponseDto>;

  stream(
    request: AiRequestDto,
    onChunk: (chunk: StreamChunkDto) => void,
    onComplete: (response: AiResponseDto) => void,
    onError: (error: Error) => void
  ): Promise<void>;

  health(): Promise<ProviderHealthStatus>;

  models(): Promise<string[]>;

  supportsTools(): boolean;

  supportsVision(): boolean;

  supportsFiles(): boolean;

  supportsStreaming(): boolean;
}
