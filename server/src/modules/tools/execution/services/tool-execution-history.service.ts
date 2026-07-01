import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ToolExecutionHistoryService {
  private readonly logger = new Logger(ToolExecutionHistoryService.name);

  async recordExecution(data: Record<string, unknown>): Promise<void> {
    this.logger.log({ action: 'execution.recorded', data });
  }
}
