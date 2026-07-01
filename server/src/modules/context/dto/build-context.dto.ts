import { IsString, IsOptional, IsUUID, IsInt, IsArray, Min, Max, IsPositive } from 'class-validator';

export class BuildContextDto {
  @IsUUID()
  readonly requestId!: string;

  @IsUUID()
  readonly conversationId!: string;

  @IsUUID()
  readonly userId!: string;

  @IsString()
  readonly query!: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(500)
  @Max(16000)
  tokenBudget?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includeSources?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeSources?: string[];
}
