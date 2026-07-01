import { IsString, IsOptional, IsInt, IsArray, IsObject, Min, Max } from 'class-validator';
import { MEMORY_DEFAULTS } from '../constants/defaults';

export class CreateMemoryDto {
  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsInt()
  @Min(MEMORY_DEFAULTS.MIN_IMPORTANCE)
  @Max(MEMORY_DEFAULTS.MAX_IMPORTANCE)
  importance?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
