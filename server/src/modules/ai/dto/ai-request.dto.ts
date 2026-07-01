import { IsString, IsBoolean, IsOptional, IsArray, IsObject, IsNumber, Min } from 'class-validator';

export class AiRequestDto {
  @IsString()
  provider?: string;

  @IsString()
  model?: string;

  @IsString()
  prompt!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  messages?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0.0)
  temperature?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxTokens?: number;

  @IsOptional()
  @IsBoolean()
  stream?: boolean;

  @IsOptional()
  @IsObject()
  options?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  requestId?: string;
}

export interface ValidatedAiRequest {
  provider: string;
  model: string;
  prompt: string;
  messages?: string[];
  temperature?: number;
  maxTokens?: number;
  stream: boolean;
  options?: Record<string, unknown>;
  requestId: string;
}
