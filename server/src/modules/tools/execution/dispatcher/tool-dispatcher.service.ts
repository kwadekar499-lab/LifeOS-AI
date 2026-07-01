import { Injectable, Logger } from '@nestjs/common';
import { ToolRegistry } from '../../registry/tool-registry';

@Injectable()
export class ToolDispatcherService {
  private readonly logger = new Logger(ToolDispatcherService.name);

  constructor(private readonly toolRegistry: ToolRegistry) {}

  async dispatch(toolName: string, params: Record<string, unknown>, userId: string): Promise<unknown> {
    this.logger.log({ toolName, userId, action: 'dispatch' });
    const tool = this.toolRegistry.find(toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }
    return tool.execute();
  }
}
