import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('tools/execute')
@UseGuards(JwtAuthGuard)
export class ToolExecutionController {
  @Post()
  async execute(@Req() req: any, @Body() body: { tool: string; params: Record<string, unknown> }) {
    return { success: true, data: null, tool: body.tool };
  }
}
