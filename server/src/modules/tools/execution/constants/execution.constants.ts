export const EXECUTION_CONSTANTS = {
  DEFAULT_TIMEOUT_MS: 30_000,
  MAX_CONCURRENT_EXECUTIONS: 10,
  HISTORY_RETENTION_DAYS: 90,
  MAX_HISTORY_ITEMS: 1000,
} as const;

export const TOOL_EXECUTION_EVENTS = {
  STARTED: 'tool.started',
  COMPLETED: 'tool.completed',
  FAILED: 'tool.failed',
  CANCELLED: 'tool.cancelled',
} as const;

export const PERMISSION_ERROR_MESSAGES = {
  TOOL_DISABLED: 'Tool is currently disabled',
  PERMISSION_DENIED: 'User does not have permission to execute this tool',
  VALIDATION_FAILED: 'Tool input validation failed',
  UNKNOWN_TOOL: 'Tool not found in registry',
  EXECUTION_FAILED: 'Tool execution failed',
  TIMEOUT: 'Tool execution timed out',
} as const;
