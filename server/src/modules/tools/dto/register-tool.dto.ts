import { IsString, IsBoolean, IsOptional, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ToolCategory } from '../types/tool-category.type';

class InputSchemaDto {
  @IsString()
  type: string;

  @IsObject()
  properties: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  required?: string[];
}

class OutputSchemaDto {
  @IsString()
  type: string;

  @IsObject()
  properties: Record<string, unknown>;
}

class PermissionDto {
  @IsString()
  action: string;

  @IsString()
  resource: string;
}

class MetadataDto {
  @IsString()
  displayName: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  examples: string[];

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];

  @IsOptional()
  estimatedExecutionTime?: number;
}

export class RegisterToolDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  category: ToolCategory;

  @IsString()
  version: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  requiresConfirmation?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions?: PermissionDto[];

  @ValidateNested()
  @Type(() => InputSchemaDto)
  inputSchema: InputSchemaDto;

  @ValidateNested()
  @Type(() => OutputSchemaDto)
  outputSchema: OutputSchemaDto;

  @ValidateNested()
  @Type(() => MetadataDto)
  metadata: MetadataDto;
}
