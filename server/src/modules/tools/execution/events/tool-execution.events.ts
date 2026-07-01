export const TOOL_EXECUTION_EVENTS = {
  STARTED: 'tool.started',
  COMPLETED: 'tool.completed',
  FAILED: 'tool.failed',
  CANCELLED: 'tool.cancelled',
} as const;

export interface ToolExecutionStartedEvent {
  type: typeof TOOL_EXECUTION_EVENTS.STARTED;
  executionId: string;
  toolId: string;
  userId: string;
  requestId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface ToolExecutionCompletedEvent {
  type: typeof TOOL_EXECUTION_EVENTS.COMPLETED;
  executionId: string;
  toolId: string;
  userId: string;
  requestId: string;
  success: boolean;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface ToolExecutionFailedEvent {
  type: typeof TOOL_EXECUTION_EVENTS.FAILED;
  executionId: string;
  toolId: string;
  userId: string;
  requestId: string;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  duration: number;
  timestamp: Date;
}

export interface ToolExecutionCancelledEvent {
  type: typeof TOOL_EXECUTION_EVENTS.CANCELLED;
  executionId: string;
  toolId: string;
  userId: string;
  requestId: string;
  timestamp: Date;
}

export type ToolExecutionEvent =
  | ToolExecutionStartedEvent
  | ToolExecutionCompletedEvent
  | ToolExecutionFailedEvent
  | ToolExecutionCancelledEvent;
