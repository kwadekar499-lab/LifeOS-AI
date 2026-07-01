import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ToolLoggerService {
  private readonly logger = new Logger('ToolSystem');

  logToolRegistration(toolName: string, toolId: string): void {
    this.logger.log({
      msg: 'Tool registered successfully',
      toolName,
      toolId,
      timestamp: new Date().toISOString(),
    });
  }

  logToolUnregistration(toolId: string): void {
    this.logger.warn({
      msg: 'Tool unregistered',
      toolId,
      timestamp: new Date().toISOString(),
    });
  }

  logToolEnabled(toolName: string, toolId: string): void {
    this.logger.log({
      msg: 'Tool enabled',
      toolName,
      toolId,
      timestamp: new Date().toISOString(),
    });
  }

  logToolDisabled(toolName: string, toolId: string): void {
    this.logger.log({
      msg: 'Tool disabled',
      toolName,
      toolId,
      timestamp: new Date().toISOString(),
    });
  }

  logToolError(toolName: string, toolId: string, error: string): void {
    this.logger.error({
      msg: 'Tool operation error',
      toolName,
      toolId,
      error,
      timestamp: new Date().toISOString(),
    });
  }
}
