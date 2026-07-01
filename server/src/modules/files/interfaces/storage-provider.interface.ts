export interface FileStorageData {
  storedName: string;
  storagePath: string;
  size: number;
}

export interface IStorageProvider {
  store(userId: string, storedName: string, buffer: Buffer, mimeType: string): Promise<FileStorageData>;

  retrieve(storagePath: string): Promise<Buffer>;
  delete(storagePath: string): Promise<void>;
  exists(storagePath: string): Promise<boolean>;
  move(oldPath: string, newPath: string): Promise<void>;
  copy(sourcePath: string, destinationPath: string): Promise<void>;
  getMetadata(storagePath: string): Promise<{
    size: number;
    createdAt: Date;
    modifiedAt: Date;
  } | null>;
}
