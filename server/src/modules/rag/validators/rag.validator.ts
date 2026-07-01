import { Injectable } from '@nestjs/common';
import { RagQueryDto } from '../dto/rag-query.dto';
import { RAG_DEFAULT_MAX_ITEMS, RAG_DEFAULT_TOKEN_BUDGET } from '../constants/rag.constants';

@Injectable()
export class RagValidator {
  validateQuery(dto: RagQueryDto): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!dto.query || dto.query.trim().length === 0) {
      errors.push('Query must not be empty');
    }

    if (dto.query && dto.query.length > 2000) {
      errors.push('Query must not exceed 2000 characters');
    }

    if (dto.tokenBudget && dto.tokenBudget < 500) {
      errors.push('Token budget must be at least 500');
    }

    if (dto.maxItems && dto.maxItems < 1) {
      errors.push('maxItems must be at least 1');
    }

    if (dto.maxItems && dto.maxItems > RAG_DEFAULT_MAX_ITEMS) {
      errors.push(`maxItems must not exceed ${RAG_DEFAULT_MAX_ITEMS}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  resolveDefaults(dto: RagQueryDto): Required<Pick<RagQueryDto, 'tokenBudget' | 'maxItems' | 'provider'>> {
    return {
      tokenBudget: dto.tokenBudget ?? RAG_DEFAULT_TOKEN_BUDGET,
      maxItems: dto.maxItems ?? RAG_DEFAULT_MAX_ITEMS,
      provider: dto.provider ?? 'mock',
    };
  }
}
