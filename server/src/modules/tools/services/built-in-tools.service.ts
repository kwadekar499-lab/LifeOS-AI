import { Injectable, OnModuleInit } from '@nestjs/common';
import { Tool } from '../interfaces/tool.interface';
import { ToolRegistry } from '../registry/tool-registry';
import { ToolLoggerService } from './tool-logger.service';
import { TOOL_DEFAULTS } from '../constants/tool-defaults';

@Injectable()
export class BuiltInToolsService implements OnModuleInit {
  constructor(
    private readonly registry: ToolRegistry,
    private readonly logger: ToolLoggerService
  ) {}

  onModuleInit(): void {
    this.registerBuiltInTools();
  }

  private registerBuiltInTools(): void {
    const tools: Tool[] = [
      this.createTaskTool(),
      this.updateTaskTool(),
      this.deleteTaskTool(),
      this.searchMemoryTool(),
      this.storeMemoryTool(),
      this.searchKnowledgeTool(),
      this.createJournalTool(),
      this.searchConversationTool(),
    ];

    for (const tool of tools) {
      try {
        this.registry.register(tool);
        this.logger.logToolRegistration(tool.name, tool.id);
      } catch (error) {
        this.logger.logToolError(tool.name, tool.id, error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }

  private createTool(
    id: string,
    name: string,
    description: string,
    category: Tool['category'],
    displayName: string,
    examples: string[],
    tags: string[],
    inputSchema: Tool['inputSchema'],
    outputSchema: Tool['outputSchema'],
    permissions: Tool['permissions'] = []
  ): Tool {
    return {
      id,
      name,
      description,
      category,
      version: '1.0.0',
      enabled: TOOL_DEFAULTS.enabled,
      requiresConfirmation: TOOL_DEFAULTS.requiresConfirmation,
      permissions,
      inputSchema,
      outputSchema,
      metadata: {
        displayName,
        description,
        examples,
        tags,
        permissions,
        estimatedExecutionTime: TOOL_DEFAULTS.estimatedExecutionTime,
      },
      execute: async () => {
        // Metadata only — no execution in Sprint 13.14
        return { success: false, message: `Tool '${name}' execution not yet implemented` };
      },
    };
  }

  private createTaskTool(): Tool {
    return this.createTool(
      'create-task',
      'CreateTask',
      'Creates a new task in the task management system',
      'Tasks',
      'Create Task',
      ['Create a new task called "Buy groceries" with high priority', 'Create task "Write documentation" due tomorrow'],
      ['tasks', 'create'],
      {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Task title' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          dueDate: { type: 'string', format: 'date-time' },
        },
        required: ['title'],
      },
      {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Created task ID' },
          success: { type: 'boolean' },
        },
      },
      [{ action: 'create', resource: 'task' }]
    );
  }

  private updateTaskTool(): Tool {
    return this.createTool(
      'update-task',
      'UpdateTask',
      'Updates an existing task in the task management system',
      'Tasks',
      'Update Task',
      ['Update task status to completed', 'Change priority of task ABC to high'],
      ['tasks', 'update'],
      {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Task ID' },
          title: { type: 'string' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          status: { type: 'string' },
        },
        required: ['id'],
      },
      {
        type: 'object',
        properties: {
          id: { type: 'string' },
          success: { type: 'boolean' },
        },
      },
      [{ action: 'update', resource: 'task' }]
    );
  }

  private deleteTaskTool(): Tool {
    return this.createTool(
      'delete-task',
      'DeleteTask',
      'Deletes a task from the task management system',
      'Tasks',
      'Delete Task',
      ['Delete task with ID ABC', 'Remove completed task XYZ'],
      ['tasks', 'delete'],
      {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Task ID to delete' },
        },
        required: ['id'],
      },
      {
        type: 'object',
        properties: {
          id: { type: 'string' },
          success: { type: 'boolean' },
        },
      },
      [{ action: 'delete', resource: 'task' }]
    );
  }

  private searchMemoryTool(): Tool {
    return this.createTool(
      'search-memory',
      'SearchMemory',
      'Searches stored memories by query, category, or tags',
      'Memory',
      'Search Memory',
      ['Find memories about project X', 'Search for memories tagged as important'],
      ['memory', 'search'],
      {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          category: { type: 'string' },
          limit: { type: 'number', default: 10 },
        },
        required: ['query'],
      },
      {
        type: 'object',
        properties: {
          results: { type: 'array', items: { type: 'object' } },
          total: { type: 'number' },
        },
      },
      [{ action: 'search', resource: 'memory' }]
    );
  }

  private storeMemoryTool(): Tool {
    return this.createTool(
      'store-memory',
      'StoreMemory',
      'Stores a new memory in the system',
      'Memory',
      'Store Memory',
      ['Store that user prefers dark mode', 'Remember project deadline is next Friday'],
      ['memory', 'store'],
      {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Memory title' },
          content: { type: 'string', description: 'Memory content' },
          category: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
        },
        required: ['title', 'content'],
      },
      {
        type: 'object',
        properties: {
          id: { type: 'string' },
          success: { type: 'boolean' },
        },
      },
      [{ action: 'create', resource: 'memory' }]
    );
  }

  private searchKnowledgeTool(): Tool {
    return this.createTool(
      'search-knowledge',
      'SearchKnowledge',
      'Searches the knowledge base for relevant information',
      'Knowledge',
      'Search Knowledge',
      ['Find information about TypeScript decorators', 'Search for REST API best practices'],
      ['knowledge', 'search'],
      {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          limit: { type: 'number', default: 10 },
        },
        required: ['query'],
      },
      {
        type: 'object',
        properties: {
          results: { type: 'array', items: { type: 'object' } },
          total: { type: 'number' },
        },
      },
      [{ action: 'search', resource: 'knowledge' }]
    );
  }

  private createJournalTool(): Tool {
    return this.createTool(
      'create-journal',
      'CreateJournal',
      'Creates a new journal entry',
      'Journal',
      'Create Journal Entry',
      ['Write a journal entry about today', 'Create a reflection journal entry'],
      ['journal', 'create'],
      {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Entry title' },
          content: { type: 'string', description: 'Entry content' },
          mood: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
        },
        required: ['content'],
      },
      {
        type: 'object',
        properties: {
          id: { type: 'string' },
          success: { type: 'boolean' },
        },
      },
      [{ action: 'create', resource: 'journal' }]
    );
  }

  private searchConversationTool(): Tool {
    return this.createTool(
      'search-conversation',
      'SearchConversation',
      'Searches past conversations for specific content',
      'Conversation',
      'Search Conversation',
      ['Find the conversation about project planning', 'Search for messages containing API keys'],
      ['conversation', 'search'],
      {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          limit: { type: 'number', default: 10 },
        },
        required: ['query'],
      },
      {
        type: 'object',
        properties: {
          results: { type: 'array', items: { type: 'object' } },
          total: { type: 'number' },
        },
      },
      [{ action: 'search', resource: 'conversation' }]
    );
  }
}
