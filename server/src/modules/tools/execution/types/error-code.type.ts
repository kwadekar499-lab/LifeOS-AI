export const ERROR_CODES = [
  'UNKNOWN_TOOL',
  'VALIDATION_FAILURE',
  'PERMISSION_DENIED',
  'EXECUTION_FAILURE',
  'TIMEOUT',
  'TOOL_DISABLED',
  'CANCELLED',
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];
