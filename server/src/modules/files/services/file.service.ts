import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { FileValidator } from '../validators/file.validator';
import { IStorageProvider, FileStorageData } from '../interfaces/storage-provider.interface';
import { IFileRepository } from '../interfaces/file-repository.interface';
import { FileEventEmitter } from '../events/file-event-emitter.service';
import { FILE_UPLOAD_CONSTANTS, FILE_ERROR_CODES } from '../constants/file-upload.constants';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly storageProvider: IStorageProvider,
    private readonly validator: FileValidator,
    private readonly eventEmitter: FileEventEmitter
  ) {}

  async uploadFile(
    userId: string,
    file: any,
    options?: {
      source?: string;
      sourceUrl?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<any> {
    const startTime = Date.now();
    const originalName = file.originalname;

    this.eventEmitter.emitUploadStarted('pending', userId, { filename: originalName });

    if (!file.buffer || file.size === 0) {
      throw new BadRequestException({
        error: 'Empty file uploaded',
        errorCode: FILE_ERROR_CODES.VALIDATION_FAILED,
      });
    }

    const sizeValidation = this.validator.validateFileSize(file.size);
    if (!sizeValidation.isValid) {
      throw new BadRequestException({
        error: sizeValidation.error,
        errorCode: sizeValidation.errorCode,
      });
    }

    const extension = this.validator.getFileExtension(originalName);
    const extValidation = this.validator.validateExtension(extension);
    if (!extValidation.isValid) {
      throw new BadRequestException({
        error: extValidation.error,
        errorCode: extValidation.errorCode,
      });
    }

    const mimeType = file.mimetype || this.validator.getMimeTypeFromExtension(extension);
    const mimeValidation = this.validator.validateMimeType(mimeType);
    if (!mimeValidation.isValid) {
      throw new BadRequestException({
        error: mimeValidation.error,
        errorCode: mimeValidation.errorCode,
      });
    }

    const checksum = this.validator.generateChecksum(file.buffer);
    const checksumKey = checksum.sha256;

    const existingFile = await this.fileRepository.findByChecksum(checksumKey);
    if (existingFile) {
      throw new BadRequestException({
        error: 'File already uploaded',
        errorCode: FILE_ERROR_CODES.DUPLICATE_FILE,
      });
    }

    const storedName = this.validator.generateStoredName(originalName, checksum.sha256);

    let storageData: FileStorageData;
    try {
      storageData = await this.storageProvider.store(userId, storedName, file.buffer, mimeType);
    } catch (error) {
      throw new BadRequestException({
        error: 'Failed to store file',
        errorCode: FILE_ERROR_CODES.STORAGE_FAILED,
      });
    }

    try {
      const createdFile = await this.fileRepository.create(userId, {
        originalName,
        storedName: storageData.storedName,
        mimeType,
        extension,
        size: file.size,
        checksum: checksumKey,
        storagePath: storageData.storagePath,
        status: FILE_UPLOAD_CONSTANTS.FILE_STATUS.READY,
        metadata: {
          ...options?.metadata,
          source: options?.source || 'manual',
          sourceUrl: options?.sourceUrl,
          uploadedAt: new Date().toISOString(),
        },
      });

      const uploadDuration = Date.now() - startTime;
      this.eventEmitter.emitUploadCompleted(createdFile.id, userId, {
        filename: originalName,
        size: file.size,
        mimeType,
        uploadDuration,
      });

      this.logger.log({
        userId,
        fileId: createdFile.id,
        filename: originalName,
        size: file.size,
        mimeType,
        uploadDuration,
        action: 'file.upload.completed',
      });

      return createdFile;
    } catch (error) {
      try {
        await this.storageProvider.delete(storageData.storagePath);
      } catch {}
      throw error;
    }
  }

  async findById(id: string, userId: string): Promise<any> {
    const file = await this.fileRepository.findById(id, userId);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async listFiles(userId: string, options?: any): Promise<any> {
    return this.fileRepository.list(userId, options);
  }

  async searchFiles(userId: string, query: string, filters?: any): Promise<any> {
    return this.fileRepository.search(userId, query, filters);
  }

  async deleteFile(id: string, userId: string): Promise<any> {
    const file = await this.fileRepository.findById(id, userId);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.fileRepository.softDelete(id, userId);

    this.eventEmitter.emitDeleted(id, userId, { filename: file.originalName });
    this.logger.log({ userId, fileId: id, action: 'file.deleted' });

    return file;
  }

  async restoreFile(id: string, userId: string): Promise<any> {
    const file = await this.fileRepository.findById(id, userId);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    const restored = await this.fileRepository.restore(id, userId);

    this.eventEmitter.emitRestored(id, userId, { filename: file.originalName });
    this.logger.log({ userId, fileId: id, action: 'file.restored' });

    return restored;
  }

  async readFile(id: string, userId: string): Promise<Buffer> {
    const file = await this.fileRepository.findById(id, userId);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return this.storageProvider.retrieve(file.storagePath);
  }

  async getFileForDownload(id: string, userId: string): Promise<{ file: any; buffer: Buffer }> {
    const file = await this.fileRepository.findById(id, userId);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    try {
      const storagePath = (file as any).storagePath || (file as any).path;
      const buffer = await this.storageProvider.retrieve(storagePath);

      this.eventEmitter.emitDownloaded(id, userId, { filename: file.originalName });
      this.logger.log({ userId, fileId: id, action: 'file.downloaded' });

      return { file, buffer };
    } catch (error) {
      throw new NotFoundException('File not found in storage');
    }
  }

  async checkFileExists(id: string, userId: string): Promise<boolean> {
    const file = await this.fileRepository.findById(id, userId);
    if (!file) return false;

    const storagePath = (file as any).storagePath || (file as any).path;
    return this.storageProvider.exists(storagePath);
  }
}
