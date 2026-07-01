export const STREAM_EVENTS = {
  STARTED: 'started',
  TOKEN: 'token',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export type StreamEventType = (typeof STREAM_EVENTS)[keyof typeof STREAM_EVENTS];
