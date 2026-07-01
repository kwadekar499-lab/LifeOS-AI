export class AiResponseDto {
  content!: string;
  model!: string;
  provider!: string;
  requestId!: string;
  latency!: number;
  tokenCount?: number;
  finishReason?: string;
  success!: boolean;
  error?: string;
}
