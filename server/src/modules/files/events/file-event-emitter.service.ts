import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FileEventEmitter {
  private readonly logger = new Logger(FileEventEmitter.name);

  emitUploadStarted(fileId: string, userId: string, _metadata?: Record<string, unknown>): void {
    this.logger.log({ userId, fileId, action: 'file.upload.started' });
  }

  emitUploadCompleted(fileId: string, userId: string, _metadata?: Record<string, unknown>): void {
    this.logger.log({ userId, fileId, action: 'file.upload.completed' });
  }

  emitDeleted(fileId: string, userId: string, _metadata?: Record<string, unknown>): void {
    this.logger.log({ userId, fileId, action: 'file.deleted' });
  }

  emitRestored(fileId: string, userId: string, _metadata?: Record<string, unknown>): void {
    this.logger.log({ userId, fileId, action: 'file.restored' });
  }

  emitDownloaded(fileId: string, userId: string, _metadata?: Record<string, unknown>): void {
    this.logger.log({ userId, fileId, action: 'file.downloaded' });
  }
}
