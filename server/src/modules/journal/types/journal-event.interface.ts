export interface JournalEvent {
  journalId: string;
  userId: string;
  action: 'created' | 'updated' | 'deleted' | 'restored';
  metadata?: Record<string, unknown>;
}
