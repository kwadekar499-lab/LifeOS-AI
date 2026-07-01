import { IsOptional, IsString, IsArray, IsDateString, MaxLength } from 'class-validator';

export class CreateJournalDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  summary?: string;

  @IsOptional()
  @IsString()
  mood?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsDateString()
  entryDate?: string;

  @IsOptional()
  metadata?: Record<string, unknown>;
}
