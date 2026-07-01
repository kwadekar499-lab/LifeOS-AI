export interface MemoryEvent {
  type: string;
  memoryId: string;
  userId: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}
