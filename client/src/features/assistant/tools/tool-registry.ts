import type { ToolDefinition, ToolResult } from "../services/assistant.service";

export interface ToolRegistry {
  register(tool: ToolDefinition): void;
  unregister(name: string): void;
  get(name: string): ToolDefinition | undefined;
  getAll(): ToolDefinition[];
  execute(name: string, params: Record<string, unknown>): Promise<ToolResult>;
}

export function createToolRegistry(): ToolRegistry {
  const tools = new Map<string, ToolDefinition>();

  return {
    register(tool: ToolDefinition) {
      tools.set(tool.name, tool);
    },

    unregister(name: string) {
      tools.delete(name);
    },

    get(name: string) {
      return tools.get(name);
    },

    getAll() {
      return Array.from(tools.values());
    },

    async execute(name: string, params: Record<string, unknown>): Promise<ToolResult> {
      const tool = tools.get(name);
      if (!tool) {
        return {
          success: false,
          error: `Tool '${name}' not found`,
        };
      }

      try {
        const result = await tool.execute(params);
        return result;
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Tool execution failed",
        };
      }
    },
  };
}

export const toolRegistry = createToolRegistry();