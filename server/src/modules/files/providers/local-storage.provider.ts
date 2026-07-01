import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { IStorageProvider, FileStorageData } from '../interfaces/storage-provider.interface';
import { FILE_UPLOAD_CONSTANTS } from '../constants/file-upload.constants';

@Injectable()
export class LocalStorageProvider implements IStorageProvider {
  private readonly logger = new Logger(LocalStorageProvider.name);
  private readonly baseStoragePath: string;

  constructor() {
    this.baseStoragePath = path.resolve(FILE_UPLOAD_CONSTANTS.STORAGE_PATH);
    this.ensureStorageDirectoryExists();
  }

  private async ensureStorageDirectoryExists(): Promise<void> {
    try {
      await fs.mkdir(this.baseStoragePath, { recursive: true });
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      this.logger.error('Failed to create storage directory', err);
      throw new Error(`Storage initialization failed: ${path.resolve(FILE_UPLOAD_CONSTANTS.STORAGE_PATH)}`);
    }
  }

  async store(userId: string, storedName: string, buffer: Buffer, mimeType: string): Promise<FileStorageData> {
    try {
      const userStoragePath = path.join(this.baseStoragePath, userId);
      await fs.mkdir(userStoragePath, { recursive: true });

      const storagePath = path.join(userStoragePath, storedName);
      await fs.writeFile(storagePath, buffer);

      this.logger.log({
        userId,
        storedName,
        storagePath,
        size: buffer.length,
        mimeType,
        action: 'file.stored',
      });

      return {
        storedName,
        storagePath,
        size: buffer.length,
      };
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      this.logger.error({
        userId,
        storedName,
        error: err.message,
        action: 'file.store.failed',
      });
      throw new Error(`Failed to store file: ${err.message}`);
    }
  }

  async retrieve(storagePath: string): Promise<Buffer> {
    try {
      const absolutePath = path.resolve(storagePath);
      const buffer = await fs.readFile(absolutePath);
      return buffer;
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      this.logger.error({
        storagePath,
        error: err.message,
        action: 'file.retrieve.failed',
      });
      throw new Error(`Failed to retrieve file: ${err.message}`);
    }
  }

  async delete(storagePath: string): Promise<void> {
    try {
      const absolutePath = path.resolve(storagePath);
      await fs.unlink(absolutePath);

      this.logger.log({
        storagePath,
        action: 'file.deleted',
      });
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === 'ENOENT') {
        this.logger.warn({
          storagePath,
          action: 'file.delete.not_found',
        });
        return;
      }

      this.logger.error({
        storagePath,
        error: err.message,
        action: 'file.delete.failed',
      });
      throw new Error(`Failed to delete file: ${err.message}`);
    }
  }

  async exists(storagePath: string): Promise<boolean> {
    try {
      const absolutePath = path.resolve(storagePath);
      await fs.access(absolutePath);
      return true;
    } catch {
      return false;
    }
  }

  async move(oldPath: string, newPath: string): Promise<void> {
    try {
      await fs.rename(oldPath, newPath);

      this.logger.log({
        oldPath,
        newPath,
        action: 'file.moved',
      });
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      this.logger.error({
        oldPath,
        newPath,
        error: err.message,
        action: 'file.move.failed',
      });
      throw new Error(`Failed to move file: ${err.message}`);
    }
  }

  async copy(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      const sourceBuffer = await fs.readFile(sourcePath);
      await fs.writeFile(destinationPath, sourceBuffer);

      this.logger.log({
        sourcePath,
        destinationPath,
        action: 'file.copied',
      });
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      this.logger.error({
        sourcePath,
        destinationPath,
        error: err.message,
        action: 'file.copy.failed',
      });
      throw new Error(`Failed to copy file: ${err.message}`);
    }
  }

  async getMetadata(storagePath: string): Promise<{
    size: number;
    createdAt: Date;
    modifiedAt: Date;
  } | null> {
    try {
      const absolutePath = path.resolve(storagePath);
      const stats = await fs.stat(absolutePath);

      return {
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      };
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === 'ENOENT') {
        return null;
      }

      this.logger.error({
        storagePath,
        error: err.message,
        action: 'file.metadata.failed',
      });
      return null;
    }
  }
}
