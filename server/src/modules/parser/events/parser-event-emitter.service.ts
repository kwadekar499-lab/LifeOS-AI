import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ParserEventEmitterService {
  private readonly logger = new Logger(ParserEventEmitterService.name);

  emitDocumentParseStarted(event: Record<string, unknown>): void {
    this.logger.log({ action: 'parse.started', ...event });
  }

  emitDocumentParseCompleted(event: Record<string, unknown>): void {
    this.logger.log({ action: 'parse.completed', ...event });
  }

  emitDocumentFailed(event: Record<string, unknown>): void {
    this.logger.log({ action: 'parse.failed', ...event });
  }

  emitDocumentChunkCreated(event: Record<string, unknown>): void {
    this.logger.log({ action: 'chunk.created', ...event });
  }

  emitDocumentDeleted(event: Record<string, unknown>): void {
    this.logger.log({ action: 'document.deleted', ...event });
  }
}
