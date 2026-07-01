import { Injectable, Logger } from '@nestjs/common';
import { IEmbeddingProvider, EmbeddingResult, ProviderInfo } from '../interfaces/embedding-provider.interface';
import { MAX_RETRIES, RETRY_DELAY_MS, DEFAULT_TIMEOUT_MS } from '../constants/embedding.constants';

@Injectable()
export class EmbeddingGateway {
  private readonly logger = new Logger(EmbeddingGateway.name);
  private provider: IEmbeddingProvider | null = null;

  registerProvider(provider: IEmbeddingProvider): void {
    this.provider = provider;
  }

  async embedText(text: string): Promise<EmbeddingResult> {
    this.ensureProvider();
    return this.withRetry(() => this.provider!.embedText(text));
  }

  async embedBatch(texts: string[], batchSize: number = 10): Promise<EmbeddingResult[]> {
    this.ensureProvider();
    const results: EmbeddingResult[] = [];
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchResults = await this.withRetry(() => this.provider!.embedBatch(batch));
      results.push(...batchResults);
    }
    return results;
  }

  async health(): Promise<boolean> {
    if (!this.provider) return false;
    return this.provider.health();
  }

  getProviderInfo(): ProviderInfo | null {
    if (!this.provider) return null;
    return this.provider.metadata();
  }

  private async withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await Promise.race([
          fn(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Embedding timeout')), DEFAULT_TIMEOUT_MS)
          ),
        ]);
        return result;
      } catch (error: unknown) {
        if (attempt === retries) throw error;
        const msg = error instanceof Error ? error.message : String(error);
        this.logger.warn(`Retry ${attempt + 1}/${retries} after error: ${msg}`);
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      }
    }
    throw new Error('Max retries exceeded');
  }

  private ensureProvider(): void {
    if (!this.provider) {
      throw new Error('No embedding provider registered');
    }
  }
}
