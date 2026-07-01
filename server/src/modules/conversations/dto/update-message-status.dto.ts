import { IsEnum, IsOptional, IsString, IsInt, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageStatus } from '../enums/message-status.enum';

export class UpdateMessageStatusDto {
  @ApiProperty({ enum: MessageStatus, description: 'New message status' })
  @IsEnum(MessageStatus)
  status: MessageStatus;

  @ApiPropertyOptional({ description: 'Updated content (for streaming updates)' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Updated output token count' })
  @IsOptional()
  @IsInt()
  tokenOutput?: number;

  @ApiPropertyOptional({ description: 'Response latency in milliseconds' })
  @IsOptional()
  @IsNumber()
  latency?: number;
}
