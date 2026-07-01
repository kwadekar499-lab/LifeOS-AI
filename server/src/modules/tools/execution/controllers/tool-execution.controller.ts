import { Controller, Post, Get, Param, Body, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { ToolExecutionService } from '../services/tool-execution.service';
import { ExecuteToolDto, ExecuteManyDto, ExecutionHistoryQueryDto } from '../dto/execute-tool.dto';

@Controller('tools')
export class ToolExecutionController {
  constructor(private readonly executionService: ToolExecutionService) {}

  @Post('execute')
  async execute(@Req() req: Request, @Body() dto: ExecuteToolDto) {
    const userId = (req as any).user?.id || (req as any).userId;
    return this.executionService.execute(userId, dto);
  }

  @Post('executeMany')
  async executeMany(@Req() req: Request, @Body() dto: ExecuteManyDto) {
    const userId = (req as any).user?.id || (req as any).userId;
    return this.executionService.executeMany(userId, dto);
  }

  @Get('history')
  async getHistory(@Req() req: Request, @Query() query: ExecutionHistoryQueryDto) {
    const userId = (req as any).user?.id || (req as any).userId;
    return this.executionService.getHistory(userId, query);
  }

  @Get('history/:id')
  async getHistoryById(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user?.id || (req as any).userId;
    return this.executionService.getHistoryById(userId, id);
  }
}
