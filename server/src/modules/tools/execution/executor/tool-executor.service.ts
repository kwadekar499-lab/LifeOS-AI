import { Injectable, Logger } from '@nestjs/common';
import { ToolRegistry } from '../../registry/tool-registry';
import { ToolDispatcherService } from '../dispatcher/tool-dispatcher.service';
import { ExecutionLoggerService } from '../services/execution-logger.service';

@Injectable()
export class ToolExecutorService {
  private readonly logger = new Logger(ToolExecutorService.name);

  constructor(
    private readonly toolRegistry: ToolRegistry,
    private readonly dispatcher: ToolDispatcherService,
    private readonly executionLogger: ExecutionLoggerService
  ) {}

  async execute(toolName: string, params: Record<string, unknown>, userId: string): Promise<unknown> {
    this.logger.log({ toolName, userId, action: 'execute' });
    const result = await this.dispatcher.dispatch(toolName, params, userId);
    this.executionLogger.logExecution({
      id: '',
      toolId: toolName,
      userId,
      requestId: '',
      status: 'completed' as any,
      arguments: params,
      duration: 0,
      timestamp: new Date(),
    });
    return result;
  }
}
