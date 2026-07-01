import { IsOptional, IsString, IsInt, IsArray, Min, Max } from 'class-validator';
import { MEMORY_DEFAULTS } from '../constants/defaults';

export class SearchMemoryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsInt()
  @Min(MEMORY_DEFAULTS.MIN_IMPORTANCE)
  @Max(MEMORY_DEFAULTS.MAX_IMPORTANCE)
  importanceMin?: number;

  @IsOptional()
  @IsInt()
  @Min(MEMORY_DEFAULTS.MIN_IMPORTANCE)
  @Max(MEMORY_DEFAULTS.MAX_IMPORTANCE)
  importanceMax?: number;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MEMORY_DEFAULTS.MAX_LIMIT)
  limit?: number;
}
