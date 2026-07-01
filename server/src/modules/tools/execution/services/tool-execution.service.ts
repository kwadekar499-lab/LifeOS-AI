import { Injectable, Logger } from '@nestjs/common';
import { ExecuteToolDto, ExecuteManyDto, ExecutionHistoryQueryDto } from '../dto/execute-tool.dto';

@Injectable()
export class ToolExecutionService {
  private readonly logger = new Logger(ToolExecutionService.name);

  async execute(userId: string, dto: ExecuteToolDto): Promise<any> {
    this.logger.log({ action: 'tool.executed', userId, toolId: dto.toolId });
    return { success: true };
  }

  async executeMany(userId: string, dto: ExecuteManyDto): Promise<any> {
    this.logger.log({ action: 'tool.executeMany', userId, count: dto.toolCalls?.length });
    return { success: true, results: [] };
  }

  async getHistory(userId: string, query: ExecutionHistoryQueryDto): Promise<any> {
    this.logger.log({ action: 'tool.getHistory', userId, query });
    return { data: [], total: 0 };
  }

  async getHistoryById(userId: string, id: string): Promise<any> {
    this.logger.log({ action: 'tool.getHistoryById', userId, id });
    return null;
  }
}