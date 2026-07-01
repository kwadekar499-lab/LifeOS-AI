import { Tool, ToolRegistration } from './tool.interface';
import { ToolCategory } from '../types/tool-category.type';

export interface ToolRegistryMetadata {
  totalTools: number;
  enabledTools: number;
  categories: ToolCategory[];
  version: string;
}

export interface IToolRegistry {
  register(tool: Tool): void;
  unregister(toolId: string): boolean;
  enable(toolId: string): boolean;
  disable(toolId: string): boolean;
  find(toolId: string): Tool | undefined;
  list(): ToolRegistration[];
  metadata(): ToolRegistryMetadata;
  categories(): ToolCategory[];
  version(): string;
}
