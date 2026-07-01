import { IsOptional, IsString, IsIn, IsObject } from 'class-validator';

export class UploadFileDto {
  @IsOptional()
  @IsString()
  @IsIn(['manual', 'import', 'attachment'])
  source?: string;

  @IsOptional()
  @IsString()
  sourceUrl?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
