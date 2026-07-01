import { Injectable, Logger } from '@nestjs/common';
import { PARSER_CONSTANTS } from '../constants/parser.constants';

export interface Chunk {
  content: string;
  chunkIndex: number;
  startOffset: number;
  endOffset: number;
  estimatedTokens: number;
  characterCount: number;
  checksum: string;
}

@Injectable()
export class SemanticChunkerService {
  private readonly logger = new Logger(SemanticChunkerService.name);

  chunk(content: string): Chunk[] {
    const startTime = Date.now();
    this.logger.log({ contentLength: content.length, action: 'chunking.started' });

    if (!content || content.trim().length === 0) {
      return [];
    }

    const chunks: Chunk[] = [];
    const { TARGET_SIZE_MIN, TARGET_SIZE_MAX, OVERLAP_SIZE_MIN, OVERLAP_SIZE_MAX } = PARSER_CONSTANTS.CHUNK;

    const targetSize = Math.floor((TARGET_SIZE_MIN + TARGET_SIZE_MAX) / 2);
    const overlapSize = Math.floor((OVERLAP_SIZE_MIN + OVERLAP_SIZE_MAX) / 2);

    let currentOffset = 0;
    let chunkIndex = 0;

    while (currentOffset < content.length) {
      let endOffset = Math.min(currentOffset + targetSize, content.length);

      if (endOffset < content.length) {
        endOffset = this.findBestBreakPoint(content, currentOffset, endOffset);
      }

      const chunkContent = content.substring(currentOffset, endOffset).trim();

      if (chunkContent.length > 0) {
        const checksum = this.calculateChecksum(chunkContent);
        const estimatedTokens = this.estimateTokens(chunkContent);

        chunks.push({
          content: chunkContent,
          chunkIndex,
          startOffset: currentOffset,
          endOffset,
          estimatedTokens,
          characterCount: chunkContent.length,
          checksum,
        });

        this.logger.debug({
          chunkIndex,
          startOffset: currentOffset,
          endOffset,
          characterCount: chunkContent.length,
          action: 'chunk.created',
        });

        chunkIndex++;
      }

      currentOffset = endOffset - overlapSize;

      if (currentOffset >= content.length - overlapSize) {
        break;
      }
    }

    const duration = Date.now() - startTime;
    this.logger.log({
      chunkCount: chunks.length,
      duration,
      action: 'chunking.completed',
    });

    return chunks;
  }

  private findBestBreakPoint(content: string, start: number, end: number): number {
    const searchRange = 400;

    const preferredEnd = Math.min(end, content.length - 1);

    for (let i = preferredEnd; i > start + searchRange; i--) {
      const char = content[i];

      if (char === '\n' || char === '. ' || char === '! ' || char === '? ') {
        return i + 1;
      }
    }

    for (let i = preferredEnd; i > start + searchRange; i--) {
      if (content[i] === ' ') {
        return i + 1;
      }
    }

    return preferredEnd;
  }

  private calculateChecksum(content: string): string {
    let hash = 0;

    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    return Math.abs(hash).toString(16);
  }

  private estimateTokens(content: string): number {
    return Math.ceil(content.length / 4);
  }
}
