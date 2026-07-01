import { IsString, IsOptional, IsObject, IsArray, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

class ToolCallDto {
  @IsString()
  toolId: string;

  @IsOptional()
  @IsObject()
  arguments?: Record<string, unknown>;
}

export class ExecuteToolDto {
  @IsString()
  toolId: string;

  @IsOptional()
  @IsObject()
  arguments?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  conversationId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class ExecuteManyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToolCallDto)
  toolCalls: ToolCallDto[];

  @IsOptional()
  @IsString()
  conversationId?: string;
}

export class ExecutionHistoryQueryDto {
  @IsOptional()
  @IsString()
  toolId?: string;

  @IsOptional()
  @IsIn(['pending', 'running', 'completed', 'failed', 'cancelled', 'timeout'])
  status?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  limit?: number;
}
