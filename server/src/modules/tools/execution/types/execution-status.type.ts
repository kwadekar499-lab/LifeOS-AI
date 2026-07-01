export const EXECUTION_STATUSES = ['pending', 'running', 'completed', 'failed', 'cancelled', 'timeout'] as const;

export type ExecutionStatus = (typeof EXECUTION_STATUSES)[number];
