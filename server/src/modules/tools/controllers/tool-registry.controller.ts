import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ToolRegistry } from '../registry/tool-registry';
import { RegisterToolDto } from '../dto/register-tool.dto';
import { Tool } from '../interfaces/tool.interface';

@Controller('tools')
export class ToolRegistryController {
  constructor(private readonly registry: ToolRegistry) {}

  @Get()
  list() {
    return this.registry.list();
  }

  @Get('metadata')
  getMetadata() {
    return this.registry.metadata();
  }

  @Get('categories')
  getCategories() {
    return this.registry.categories();
  }

  @Get('version')
  getVersion() {
    return { version: this.registry.version() };
  }

  @Get(':id')
  find(@Param('id') id: string) {
    const tool = this.registry.find(id);
    if (!tool) {
      return { found: false, message: `Tool with id '${id}' not found` };
    }
    return { found: true, tool };
  }

  @Post()
  register(@Body() dto: RegisterToolDto) {
    const tool: Tool = {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      category: dto.category as Tool['category'],
      version: dto.version,
      enabled: dto.enabled ?? true,
      requiresConfirmation: dto.requiresConfirmation ?? false,
      permissions: dto.permissions ?? [],
      inputSchema: dto.inputSchema,
      outputSchema: dto.outputSchema,
      metadata: {
        displayName: dto.metadata.displayName,
        description: dto.metadata.description,
        examples: dto.metadata.examples,
        tags: dto.metadata.tags,
        permissions: dto.metadata.permissions,
        estimatedExecutionTime: dto.metadata.estimatedExecutionTime ?? 100,
      },
      execute: async () => {
        return { success: false, message: `Tool '${tool.name}' execution not yet implemented` };
      },
    };

    this.registry.register(tool);
    return { success: true, toolId: tool.id };
  }

  @Patch(':id/enable')
  enable(@Param('id') id: string) {
    const result = this.registry.enable(id);
    return { success: result, toolId: id, enabled: true };
  }

  @Patch(':id/disable')
  disable(@Param('id') id: string) {
    const result = this.registry.disable(id);
    return { success: result, toolId: id, enabled: false };
  }

  @Delete(':id')
  unregister(@Param('id') id: string) {
    const result = this.registry.unregister(id);
    return { success: result, toolId: id };
  }
}
