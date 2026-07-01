import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChatRequestDto {
  @ApiProperty({
    description: 'User message content',
    example: 'Hello, how can you help me today?',
  })
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiPropertyOptional({
    description: 'Conversation ID (optional for new conversations)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  conversationId?: string;

  @ApiPropertyOptional({
    description: 'Provider name',
    example: 'mock',
    default: 'mock',
  })
  @IsString()
  @IsOptional()
  provider?: string;

  @ApiPropertyOptional({
    description: 'Model name',
    example: 'mock-model',
    default: 'mock-model',
  })
  @IsString()
  @IsOptional()
  model?: string;
}
