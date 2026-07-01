export interface ProviderHealthStatus {
  provider: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  latency: number;
  availableModels: string[];
  streamingSupported: boolean;
}

export interface ProviderMetrics {
  requestId: string;
  provider: string;
  model: string;
  latency: number;
  success: boolean;
  error?: string;
}
