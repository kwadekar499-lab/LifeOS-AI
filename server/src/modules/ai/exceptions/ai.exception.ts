export class AiGatewayException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly provider?: string,
    public readonly requestId?: string
  ) {
    super(message);
    this.name = 'AiGatewayException';
  }
}

export class ProviderNotFoundException extends AiGatewayException {
  constructor(providerName: string, requestId?: string) {
    super(`AI provider '${providerName}' not found in registry`, 'PROVIDER_NOT_FOUND', providerName, requestId);
    this.name = 'ProviderNotFoundException';
  }
}

export class ProviderNotRegisteredException extends AiGatewayException {
  constructor(providerName: string, requestId?: string) {
    super(`AI provider '${providerName}' is not registered`, 'PROVIDER_NOT_REGISTERED', providerName, requestId);
    this.name = 'ProviderNotRegisteredException';
  }
}

export class AiGenerationException extends AiGatewayException {
  constructor(
    message: string,
    provider: string,
    requestId?: string,
    public readonly originalError?: unknown
  ) {
    super(message, 'GENERATION_FAILED', provider, requestId);
    this.name = 'AiGenerationException';
  }
}
