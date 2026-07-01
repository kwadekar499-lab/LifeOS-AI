import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateConversationDto {
  @ApiPropertyOptional({ description: 'Conversation title' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;
}
