export const FILE_UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 25 * 1024 * 1024,
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
    'image/png',
    'image/jpeg',
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.docx', '.txt', '.md', '.png', '.jpg', '.jpeg'],
  BLOCKED_EXTENSIONS: [
    '.exe',
    '.bat',
    '.cmd',
    '.sh',
    '.js',
    '.ts',
    '.py',
    '.rb',
    '.php',
    '.pl',
    '.jar',
    '.msi',
    '.dll',
    '.so',
    '.dylib',
    '.zip',
    '.rar',
    '.7z',
    '.tar',
    '.gz',
  ],
  STORAGE_PATH: './uploads/files',
  FILE_STATUS: {
    READY: 'ready',
    PROCESSING: 'processing',
    FAILED: 'failed',
  } as const,
} as const;

export const FILE_EVENTS = {
  UPLOAD_STARTED: 'file.upload.started',
  UPLOAD_COMPLETED: 'file.upload.completed',
  DELETED: 'file.deleted',
  RESTORED: 'file.restored',
  DOWNLOADED: 'file.downloaded',
} as const;

export const FILE_ERROR_CODES = {
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  UNSUPPORTED_TYPE: 'UNSUPPORTED_TYPE',
  DUPLICATE_FILE: 'DUPLICATE_FILE',
  NOT_FOUND: 'NOT_FOUND',
  STORAGE_FAILED: 'STORAGE_FAILED',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const;
