import { Injectable, Inject, Logger } from '@nestjs/common';
import { AiProviderInterface } from '../interfaces/ai-provider.interface';
import { ProviderNotRegisteredException, ProviderNotFoundException } from '../exceptions/ai.exception';
import { AI_GATEWAY_CONFIG, AiGatewayConfig } from '../config/ai-config';

@Injectable()
export class ProviderRegistry {
  private readonly logger = new Logger(ProviderRegistry.name);
  private readonly providers: Map<string, AiProviderInterface> = new Map();
  private defaultProviderName: string;

  constructor(@Inject(AI_GATEWAY_CONFIG) config: AiGatewayConfig) {
    this.defaultProviderName = config.defaultProvider;
  }

  registerProvider(provider: AiProviderInterface): void {
    const name = provider.name;
    if (this.providers.has(name)) {
      this.logger.warn(`Provider '${name}' is already registered. Overwriting.`);
    }
    this.providers.set(name, provider);
    this.logger.log(`Provider '${name}' registered successfully`);
  }

  unregisterProvider(name: string): boolean {
    const removed = this.providers.delete(name);
    if (removed) {
      this.logger.log(`Provider '${name}' unregistered`);
    }
    return removed;
  }

  getProvider(name?: string): AiProviderInterface {
    const providerName = name || this.defaultProviderName;

    if (!this.providers.has(providerName)) {
      if (name) {
        throw new ProviderNotFoundException(name);
      }
      throw new ProviderNotRegisteredException(providerName);
    }

    return this.providers.get(providerName)!;
  }

  getDefaultProvider(): AiProviderInterface {
    return this.getProvider(this.defaultProviderName);
  }

  setDefaultProvider(name: string): void {
    if (!this.providers.has(name)) {
      throw new ProviderNotFoundException(name);
    }
    this.defaultProviderName = name;
    this.logger.log(`Default provider set to '${name}'`);
  }

  listProviders(): AiProviderInterface[] {
    return Array.from(this.providers.values());
  }

  listProviderNames(): string[] {
    return Array.from(this.providers.keys());
  }

  hasProvider(name: string): boolean {
    return this.providers.has(name);
  }

  get providerCount(): number {
    return this.providers.size;
  }

  get defaultProvider(): string {
    return this.defaultProviderName;
  }
}
