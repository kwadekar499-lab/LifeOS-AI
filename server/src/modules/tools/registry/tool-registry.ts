import { Injectable, Logger } from '@nestjs/common';
import { Tool, ToolRegistration } from '../interfaces/tool.interface';
import { ToolCategory } from '../types/tool-category.type';
import { TOOL_CATEGORIES } from '../types/tool-category.type';
import { TOOL_REGISTRY_VERSION } from '../constants/tool-defaults';
import { ToolValidator } from '../validators/tool-validator';
import { ToolRegistryMetadata, IToolRegistry } from '../interfaces/tool-registry.interface';

@Injectable()
export class ToolRegistry implements IToolRegistry {
  private readonly logger = new Logger(ToolRegistry.name);
  private readonly tools: Map<string, ToolRegistration> = new Map();

  constructor(private readonly validator: ToolValidator) {}

  register(tool: Tool): void {
    this.validator.validateDuplicateId(tool.id);
    this.validator.validateRegistration(tool);

    const registration: ToolRegistration = {
      tool: {
        ...tool,
        enabled: tool.enabled ?? true,
        requiresConfirmation: tool.requiresConfirmation ?? false,
      },
      registeredAt: new Date(),
    };

    this.tools.set(tool.id, registration);
    this.validator.markIdRegistered(tool.id);

    this.logger.log({
      msg: 'Tool registered',
      toolName: tool.name,
      toolId: tool.id,
      registrationTime: registration.registeredAt.toISOString(),
      enabled: registration.tool.enabled,
    });
  }

  unregister(toolId: string): boolean {
    const existed = this.tools.delete(toolId);
    if (existed) {
      this.validator.unmarkId(toolId);
      this.logger.warn({
        msg: 'Tool unregistered',
        toolId,
      });
    }
    return existed;
  }

  enable(toolId: string): boolean {
    const registration = this.tools.get(toolId);
    if (!registration) {
      return false;
    }
    registration.tool.enabled = true;
    this.logger.log({
      msg: 'Tool enabled',
      toolId,
      toolName: registration.tool.name,
    });
    return true;
  }

  disable(toolId: string): boolean {
    const registration = this.tools.get(toolId);
    if (!registration) {
      return false;
    }
    registration.tool.enabled = false;
    this.logger.log({
      msg: 'Tool disabled',
      toolId,
      toolName: registration.tool.name,
    });
    return true;
  }

  find(toolId: string): Tool | undefined {
    const registration = this.tools.get(toolId);
    return registration?.tool;
  }

  list(): ToolRegistration[] {
    return Array.from(this.tools.values());
  }

  metadata(): ToolRegistryMetadata {
    const allTools = Array.from(this.tools.values());
    const enabledTools = allTools.filter((t) => t.tool.enabled).length;

    return {
      totalTools: allTools.length,
      enabledTools,
      categories: this.categories(),
      version: this.version(),
    };
  }

  categories(): ToolCategory[] {
    return [...TOOL_CATEGORIES];
  }

  version(): string {
    return TOOL_REGISTRY_VERSION;
  }
}
