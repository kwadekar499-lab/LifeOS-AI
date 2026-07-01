import { Injectable, Logger } from '@nestjs/common';
import { ToolExecutionHistory, IExecutionLogger } from '../interfaces/tool-execution.interface';
import { TOOL_EXECUTION_EVENTS } from '../events/tool-execution.events';

@Injectable()
export class ExecutionLoggerService implements IExecutionLogger {
  private readonly logger = new Logger('ToolExecution');

  logExecution(execution: ToolExecutionHistory): void {
    this.logger.log({
      msg: 'Tool execution recorded',
      executionId: execution.id,
      toolId: execution.toolId,
      userId: execution.userId,
      status: execution.status,
      duration: execution.duration,
      timestamp: execution.timestamp.toISOString(),
    });
  }

  logStart(execution: Partial<ToolExecutionHistory>): void {
    this.logger.log({
      msg: TOOL_EXECUTION_EVENTS.STARTED,
      executionId: execution.id,
      toolId: execution.toolId,
      userId: execution.userId,
      requestId: execution.requestId,
      timestamp: new Date().toISOString(),
    });
  }

  logCompletion(execution: ToolExecutionHistory): void {
    this.logger.log({
      msg: TOOL_EXECUTION_EVENTS.COMPLETED,
      executionId: execution.id,
      toolId: execution.toolId,
      userId: execution.userId,
      requestId: execution.requestId,
      status: execution.status,
      duration: execution.duration,
      timestamp: execution.timestamp.toISOString(),
    });
  }

  logFailure(execution: ToolExecutionHistory, error: Error): void {
    this.logger.error({
      msg: TOOL_EXECUTION_EVENTS.FAILED,
      executionId: execution.id,
      toolId: execution.toolId,
      userId: execution.userId,
      requestId: execution.requestId,
      error: error.message,
      duration: execution.duration,
      timestamp: execution.timestamp.toISOString(),
    });
  }

  logCancellation(execution: ToolExecutionHistory): void {
    this.logger.warn({
      msg: TOOL_EXECUTION_EVENTS.CANCELLED,
      executionId: execution.id,
      toolId: execution.toolId,
      userId: execution.userId,
      requestId: execution.requestId,
      timestamp: execution.timestamp.toISOString(),
    });
  }
}
