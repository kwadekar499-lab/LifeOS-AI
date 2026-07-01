import { SetMetadata } from '@nestjs/common';

export const TOOL_METADATA_KEY = 'tool:metadata';

export interface ToolDecoratorOptions {
  id: string;
  name: string;
  description: string;
  category: string;
  version?: string;
}

export const ToolDecorator = (options: ToolDecoratorOptions) => SetMetadata(TOOL_METADATA_KEY, options);
