export const AI_GATEWAY_CONFIG = 'AI_GATEWAY_CONFIG';

export interface AiGatewayConfig {
  defaultProvider: string;
  requestTimeout: number;
  retryCount: number;
  streamingEnabled: boolean;
  modelOverrides?: Record<string, string>;
}

export const DEFAULT_AI_GATEWAY_CONFIG: AiGatewayConfig = {
  defaultProvider: 'mock',
  requestTimeout: 30_000,
  retryCount: 1,
  streamingEnabled: true,
};

export function loadAiGatewayConfig(): AiGatewayConfig {
  return {
    defaultProvider: process.env.AI_DEFAULT_PROVIDER || DEFAULT_AI_GATEWAY_CONFIG.defaultProvider,
    requestTimeout: Number(process.env.AI_REQUEST_TIMEOUT) || DEFAULT_AI_GATEWAY_CONFIG.requestTimeout,
    retryCount: Number(process.env.AI_RETRY_COUNT) || DEFAULT_AI_GATEWAY_CONFIG.retryCount,
    streamingEnabled: process.env.AI_STREAMING_ENABLED !== 'false' ? DEFAULT_AI_GATEWAY_CONFIG.streamingEnabled : false,
    modelOverrides: process.env.AI_MODEL_OVERRIDES
      ? (JSON.parse(process.env.AI_MODEL_OVERRIDES) as Record<string, string>)
      : undefined,
  };
}
