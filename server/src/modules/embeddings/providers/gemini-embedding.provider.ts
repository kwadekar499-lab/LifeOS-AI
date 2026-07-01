import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { IEmbeddingProvider, EmbeddingResult, ProviderInfo } from '../interfaces/embedding-provider.interface';

@Injectable()
export class GeminiEmbeddingProvider implements IEmbeddingProvider {
  private readonly model: string = 'embedding-001';
  private readonly embedDim: number = 768;
  private client: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY') || 'demo';
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async embedText(text: string): Promise<EmbeddingResult> {
    const start = Date.now();
    const model = this.client.getGenerativeModel({ model: this.model });
    const result = await model.generateContent(text);
    await result.response;
    const embedding: number[] = [];
    const latency = Date.now() - start;
    return {
      embedding: embedding,
      metadata: {
        provider: 'gemini',
        model: this.model,
        dimensions: this.embedDim,
        latency,
        tokenCount: null,
        costEstimate: 0,
      },
    };
  }

  async embedBatch(texts: string[]): Promise<EmbeddingResult[]> {
    const results: EmbeddingResult[] = [];
    for (const text of texts) {
      results.push(await this.embedText(text));
    }
    return results;
  }

  async health(): Promise<boolean> {
    try {
      await this.embedText('health');
      return true;
    } catch {
      return false;
    }
  }

  dimensions(): number {
    return this.embedDim;
  }

  metadata(): ProviderInfo {
    return {
      name: 'gemini',
      model: this.model,
      dimensions: this.embedDim,
      healthy: true,
    };
  }
}
