import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchConversationsDto {
  @ApiPropertyOptional({ description: 'Search query for title, summary, or last message' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  q?: string;

  @ApiPropertyOptional({ description: 'Number of results per page', default: 20 })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Cursor for pagination' })
  @IsOptional()
  @IsString()
  cursor?: string;
}
