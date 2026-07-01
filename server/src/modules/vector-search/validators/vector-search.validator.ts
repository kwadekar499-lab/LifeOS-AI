import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class VectorSearchValidator {
  validateEmbeddingDimensions(queryEmbedding: number[], candidateEmbedding: number[], providerName: string): void {
    if (queryEmbedding.length !== candidateEmbedding.length) {
      throw new BadRequestException(
        `Embedding dimension mismatch for provider ${providerName}: query=${queryEmbedding.length}, candidate=${candidateEmbedding.length}`
      );
    }
  }

  validateTopK(topK: number): void {
    if (topK < 1 || topK > 50) {
      throw new BadRequestException(`TopK must be between 1 and 50, got: ${topK}`);
    }
  }

  validateThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 1) {
      throw new BadRequestException(`Threshold must be between 0 and 1, got: ${threshold}`);
    }
  }

  validateQueryEmbedding(embedding: number[]): void {
    if (!embedding || embedding.length === 0) {
      throw new BadRequestException('Query embedding cannot be empty');
    }
  }
}
