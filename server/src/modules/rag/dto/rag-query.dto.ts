import { IsString, IsOptional, IsUUID, IsInt, IsArray, Min, Max, IsPositive } from 'class-validator';

export class RagQueryDto {
  @IsString()
  readonly query!: string;

  @IsOptional()
  @IsUUID()
  readonly conversationId?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(500)
  @Max(16000)
  readonly tokenBudget?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly includeSources?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly excludeSources?: string[];

  @IsOptional()
  @IsString()
  readonly provider?: string;

  @IsOptional()
  @IsString()
  readonly model?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly maxItems?: number;
}
