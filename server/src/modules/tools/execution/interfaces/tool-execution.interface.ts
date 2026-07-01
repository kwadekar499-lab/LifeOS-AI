import { Tool } from '../../interfaces/tool.interface';
import { ExecutionStatus, ErrorCode } from '../types';

export interface ToolExecutionContext {
  requestId: string;
  conversationId?: string;
  userId: string;
  permissions: string[];
  arguments: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface ToolExecutionOptions {
  timeout?: number;
  cancellationToken?: AbortSignal;
}

export interface ToolExecutionResult {
  toolId: string;
  success: boolean;
  output?: unknown;
  error?: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
  duration: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface ToolExecutionHistory {
  id: string;
  toolId: string;
  userId: string;
  conversationId?: string;
  requestId: string;
  status: ExecutionStatus;
  arguments: Record<string, unknown>;
  result?: ToolExecutionResult;
  duration: number;
  timestamp: Date;
}

export interface IToolExecutor {
  execute(toolId: string, context: ToolExecutionContext, options?: ToolExecutionOptions): Promise<ToolExecutionResult>;

  executeMany(
    toolCalls: Array<{
      toolId: string;
      context: ToolExecutionContext;
      options?: ToolExecutionOptions;
    }>,
    options?: ToolExecutionOptions
  ): Promise<ToolExecutionResult[]>;

  cancel(requestId: string): boolean;

  validate(tool: Tool, arguments_: Record<string, unknown>): boolean;
}

export interface IToolDispatcher {
  dispatch(toolId: string, context: ToolExecutionContext, options?: ToolExecutionOptions): Promise<ToolExecutionResult>;
}

export interface IPermissionValidator {
  validate(tool: Tool, context: ToolExecutionContext): Promise<{ granted: boolean; reason?: string }>;
}

export interface IExecutionLogger {
  logExecution(execution: ToolExecutionHistory): void;
  logStart(execution: Partial<ToolExecutionHistory>): void;
  logCompletion(execution: ToolExecutionHistory): void;
  logFailure(execution: ToolExecutionHistory, error: Error): void;
  logCancellation(execution: ToolExecutionHistory): void;
}

export interface IToolExecutionHistoryService {
  record(execution: ToolExecutionHistory): Promise<void>;
  findById(id: string, userId: string): Promise<ToolExecutionHistory | null>;
  findByUserId(userId: string, limit?: number): Promise<ToolExecutionHistory[]>;
  findByToolId(toolId: string, userId: string, limit?: number): Promise<ToolExecutionHistory[]>;
  cleanup(): Promise<void>;
}
