import { Injectable } from '@nestjs/common';
import { Tool } from '../interfaces/tool.interface';
import { TOOL_CATEGORIES } from '../types/tool-category.type';

@Injectable()
export class ToolValidator {
  private registeredIds: Set<string> = new Set();

  validateRegistration(tool: Tool): void {
    this.validateId(tool.id);
    this.validateName(tool.name);
    this.validateDescription(tool.description);
    this.validateCategory(tool.category);
    this.validateVersion(tool.version);
    this.validateInputSchema(tool.inputSchema);
    this.validateOutputSchema(tool.outputSchema);
    this.validatePermissions(tool.permissions);
  }

  validateDuplicateId(id: string): void {
    if (this.registeredIds.has(id)) {
      throw new Error(`Duplicate tool registration: tool with id '${id}' is already registered`);
    }
  }

  markIdRegistered(id: string): void {
    this.registeredIds.add(id);
  }

  unmarkId(id: string): void {
    this.registeredIds.delete(id);
  }

  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error('Tool id is required');
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      throw new Error(
        `Invalid tool id format: '${id}'. Must contain only alphanumeric characters, hyphens, and underscores`
      );
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Tool name is required');
    }
  }

  private validateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new Error('Tool description is required');
    }
  }

  private validateCategory(category: string): void {
    if (!category) {
      throw new Error('Tool category is required');
    }
    if (!TOOL_CATEGORIES.includes(category as never)) {
      throw new Error(`Invalid tool category: '${category}'. Must be one of: ${TOOL_CATEGORIES.join(', ')}`);
    }
  }

  private validateVersion(version: string): void {
    if (!version || version.trim().length === 0) {
      throw new Error('Tool version is required');
    }
    if (!/^\d+\.\d+\.\d+$/.test(version)) {
      throw new Error(`Invalid tool version format: '${version}'. Must follow semver (e.g., 1.0.0)`);
    }
  }

  private validateInputSchema(inputSchema: unknown): void {
    if (!inputSchema) {
      throw new Error('Tool input schema is required');
    }
    const schema = inputSchema as { type?: string };
    if (!schema.type || schema.type.trim().length === 0) {
      throw new Error('Tool input schema type is required');
    }
  }

  private validateOutputSchema(outputSchema: unknown): void {
    if (!outputSchema) {
      throw new Error('Tool output schema is required');
    }
    const schema = outputSchema as { type?: string };
    if (!schema.type || schema.type.trim().length === 0) {
      throw new Error('Tool output schema type is required');
    }
  }

  private validatePermissions(permissions: unknown[]): void {
    if (!Array.isArray(permissions)) {
      throw new Error('Tool permissions must be an array');
    }
    for (const perm of permissions) {
      const p = perm as { action?: string; resource?: string };
      if (!p.action || p.action.trim().length === 0) {
        throw new Error('Each permission must have an action');
      }
      if (!p.resource || p.resource.trim().length === 0) {
        throw new Error('Each permission must have a resource');
      }
    }
  }
}
