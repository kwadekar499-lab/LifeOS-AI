import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StreamEventEmitter } from './stream-event.emitter';
import { StreamMetricsService } from './stream-metrics.service';
import { MockTokenGeneratorService } from './mock-token-generator.service';
import { StreamEvent } from '../interfaces/stream-event.interface';
import { StreamState } from '../enums/stream-state.enum';

@Injectable()
export class StreamingService {
  private readonly logger = new Logger(StreamingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: StreamEventEmitter,
    private readonly metricsService: StreamMetricsService,
    private readonly tokenGenerator: MockTokenGeneratorService
  ) {}

  async *streamResponse(
    streamId: string,
    messageId: string,
    conversationId: string,
    content: string
  ): AsyncGenerator<string, void, unknown> {
    try {
      this.metricsService.start(streamId);
      this.emitEvent(streamId, StreamState.STARTED, { messageId, conversationId });

      const fullText = content;
      const tokens: string[] = [];

      for await (const token of this.tokenGenerator.generateTokens(fullText)) {
        tokens.push(token);
        this.metricsService.recordToken(streamId);
        this.emitEvent(streamId, StreamState.STREAMING, {
          messageId,
          conversationId,
          token,
        });
        yield token;
      }

      const assembledText = tokens.join('');
      await this.prisma.message.update({
        where: { id: messageId },
        data: {
          content: assembledText,
          tokenOutput: tokens.length,
          status: 'COMPLETED',
        },
      });

      this.metricsService.complete(streamId);
      this.emitEvent(streamId, StreamState.COMPLETED, {
        messageId,
        conversationId,
        metadata: { tokenCount: tokens.length },
      });

      this.eventEmitter.complete(streamId);
      this.metricsService.cleanup(streamId);
    } catch (error) {
      this.logger.error(`Stream error for ${streamId}: ${error}`);
      this.metricsService.cancel(streamId);
      this.emitEvent(streamId, StreamState.FAILED, {
        messageId,
        conversationId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      this.eventEmitter.complete(streamId);
      this.metricsService.cleanup(streamId);
      throw error;
    }
  }

  cancelStream(streamId: string): void {
    this.metricsService.cancel(streamId);
    this.emitEvent(streamId, StreamState.CANCELLED, {});
    this.eventEmitter.complete(streamId);
    this.metricsService.cleanup(streamId);
    this.logger.debug(`Stream cancelled: ${streamId}`);
  }

  private emitEvent(streamId: string, state: StreamState, data: Record<string, unknown>): void {
    const event: StreamEvent = {
      type: state.toLowerCase() as StreamEvent['type'],
      data,
      timestamp: new Date(),
    };
    this.eventEmitter.emit(streamId, event);
  }
}
