import { ToolCategory } from '../types/tool-category.type';

export interface ToolInputSchema {
  type: string;
  properties: Record<string, unknown>;
  required?: string[];
}

export interface ToolOutputSchema {
  type: string;
  properties: Record<string, unknown>;
}

export interface ToolPermission {
  action: string;
  resource: string;
}

export interface ToolMetadata {
  displayName: string;
  description: string;
  examples: string[];
  tags: string[];
  permissions: ToolPermission[];
  estimatedExecutionTime: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  version: string;
  enabled: boolean;
  requiresConfirmation: boolean;
  permissions: ToolPermission[];
  inputSchema: ToolInputSchema;
  outputSchema: ToolOutputSchema;
  metadata: ToolMetadata;
  execute(): Promise<unknown>;
}

export interface ToolRegistration {
  tool: Tool;
  registeredAt: Date;
}
