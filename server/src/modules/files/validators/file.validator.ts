import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { FileValidationResult } from '../types/file-upload.type';
import { FILE_UPLOAD_CONSTANTS } from '../constants/file-upload.constants';

type AllowedMimeType = (typeof FILE_UPLOAD_CONSTANTS.ALLOWED_MIME_TYPES)[number];
type AllowedExtension = (typeof FILE_UPLOAD_CONSTANTS.ALLOWED_EXTENSIONS)[number];
type BlockedExtension = (typeof FILE_UPLOAD_CONSTANTS.BLOCKED_EXTENSIONS)[number];

@Injectable()
export class FileValidator {
  private readonly allowedMimeTypes: AllowedMimeType[];
  private readonly allowedExtensions: AllowedExtension[];
  private readonly blockedExtensions: BlockedExtension[];

  constructor() {
    this.allowedMimeTypes = [...FILE_UPLOAD_CONSTANTS.ALLOWED_MIME_TYPES];
    this.allowedExtensions = [...FILE_UPLOAD_CONSTANTS.ALLOWED_EXTENSIONS];
    this.blockedExtensions = [...FILE_UPLOAD_CONSTANTS.BLOCKED_EXTENSIONS];
  }

  validateFileSize(size: number): FileValidationResult {
    if (size > FILE_UPLOAD_CONSTANTS.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size exceeds maximum limit of ${FILE_UPLOAD_CONSTANTS.MAX_FILE_SIZE / 1024 / 1024}MB`,
        errorCode: 'FILE_TOO_LARGE',
      };
    }
    return { isValid: true };
  }

  validateMimeType(mimeType: string): FileValidationResult {
    if (!this.allowedMimeTypes.includes(mimeType as AllowedMimeType)) {
      return {
        isValid: false,
        error: `Unsupported MIME type: ${mimeType}`,
        errorCode: 'UNSUPPORTED_TYPE',
      };
    }
    return { isValid: true };
  }

  validateExtension(extension: string): FileValidationResult {
    const lowerExtension = extension.toLowerCase() as AllowedExtension | BlockedExtension;

    if (!this.allowedExtensions.includes(lowerExtension as AllowedExtension)) {
      return {
        isValid: false,
        error: `Unsupported file extension: ${extension}`,
        errorCode: 'UNSUPPORTED_TYPE',
      };
    }

    if (this.blockedExtensions.includes(lowerExtension as BlockedExtension)) {
      return {
        isValid: false,
        error: `Blocked file extension: ${extension}`,
        errorCode: 'UNSUPPORTED_TYPE',
      };
    }

    return { isValid: true };
  }

  validateFilename(filename: string): FileValidationResult {
    const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    if (sanitized !== filename) {
      return {
        isValid: false,
        error: 'Filename contains invalid characters',
        errorCode: 'VALIDATION_FAILED',
      };
    }
    return { isValid: true };
  }

  getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 ? filename.substring(lastDot).toLowerCase() : '';
  }

  getMimeTypeFromExtension(extension: string): string {
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
      '.md': 'text/markdown',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
    };
    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
  }

  generateChecksum(buffer: Buffer): { md5: string; sha256: string } {
    const md5Hash = crypto.createHash('md5').update(buffer).digest('hex');
    const sha256Hash = crypto.createHash('sha256').update(buffer).digest('hex');
    return { md5: md5Hash, sha256: sha256Hash };
  }

  generateStoredName(originalName: string, checksum: string): string {
    const extension = this.getFileExtension(originalName);
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    return `${checksum.substring(0, 16)}_${timestamp}_${randomString}${extension}`;
  }
}
