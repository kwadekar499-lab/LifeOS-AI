import { IsString, IsOptional, IsEnum, IsObject, IsArray, IsInt, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageStatus } from '../enums/message-status.enum';

export class CreateMessageDto {
  @ApiProperty({ description: 'Message role (user, assistant, system)' })
  @IsString()
  role: string;

  @ApiProperty({ description: 'Message content' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ enum: MessageStatus, default: MessageStatus.PENDING })
  @IsOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;

  @ApiPropertyOptional({ description: 'AI provider name' })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({ description: 'AI model name' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ description: 'Input token count' })
  @IsOptional()
  @IsInt()
  tokenInput?: number;

  @ApiPropertyOptional({ description: 'Output token count' })
  @IsOptional()
  @IsInt()
  tokenOutput?: number;

  @ApiPropertyOptional({ description: 'Response latency in milliseconds' })
  @IsOptional()
  @IsNumber()
  latency?: number;

  @ApiPropertyOptional({ description: 'Attachments metadata' })
  @IsOptional()
  @IsArray()
  attachments?: Record<string, unknown>[];

  @ApiPropertyOptional({ description: 'Tool calls data' })
  @IsOptional()
  @IsArray()
  toolCalls?: Record<string, unknown>[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
