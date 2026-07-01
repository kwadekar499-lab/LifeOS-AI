import { Injectable, Logger } from '@nestjs/common';
import {
  IVectorSearchProvider,
  SearchOptions,
  ISimilarityResult,
  VectorSearchProviderInfo,
} from '../interfaces/vector-search.provider.interface';

@Injectable()
export class VectorSearchGateway {
  private readonly logger = new Logger(VectorSearchGateway.name);
  private providers: Map<string, IVectorSearchProvider> = new Map();
  private defaultProvider: string | null = null;

  registerProvider(provider: IVectorSearchProvider, isDefault = false): void {
    const info = provider.metadata();
    this.providers.set(info.name, provider);
    if (isDefault || !this.defaultProvider) {
      this.defaultProvider = info.name;
    }
    this.logger.log(`Registered vector search provider: ${info.name}`);
  }

  async search(
    queryEmbedding: number[],
    options: SearchOptions = { topK: 10, threshold: 0.7 }
  ): Promise<ISimilarityResult[]> {
    this.ensureProvider();
    const provider = this.providers.get(this.defaultProvider!)!;
    return provider.search(queryEmbedding, options);
  }

  async searchBatch(
    queryEmbeddings: number[][],
    options: SearchOptions = { topK: 10, threshold: 0.7 }
  ): Promise<ISimilarityResult[][]> {
    this.ensureProvider();
    const provider = this.providers.get(this.defaultProvider!)!;
    return provider.searchBatch(queryEmbeddings, options);
  }

  async health(): Promise<boolean> {
    this.ensureProvider();
    const provider = this.providers.get(this.defaultProvider!)!;
    return provider.health();
  }

  getProviders(): VectorSearchProviderInfo[] {
    return Array.from(this.providers.values()).map((p) => p.metadata());
  }

  getDefaultProvider(): VectorSearchProviderInfo | null {
    if (!this.defaultProvider) return null;
    const provider = this.providers.get(this.defaultProvider);
    return provider ? provider.metadata() : null;
  }

  private ensureProvider(): void {
    if (!this.defaultProvider || !this.providers.has(this.defaultProvider)) {
      throw new Error('No vector search provider registered');
    }
  }
}
