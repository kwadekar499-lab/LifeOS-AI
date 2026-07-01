export interface FileEvent {
  type: string;
  fileId: string;
  userId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}
