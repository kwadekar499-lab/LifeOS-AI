import { IsOptional, IsString, IsNumber, IsArray, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchVectorDto {
  @ApiProperty({ description: 'Search query text', example: 'project planning notes' })
  @IsString()
  query!: string;

  @ApiPropertyOptional({ description: 'Number of top results to return', default: 10, minimum: 1, maximum: 50 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  topK?: number;

  @ApiPropertyOptional({ description: 'Minimum similarity threshold', default: 0.7, minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  threshold?: number;

  @ApiPropertyOptional({ description: 'Filter by file IDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fileIds?: string[];

  @ApiPropertyOptional({ description: 'Filter by knowledge IDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  knowledgeIds?: string[];

  @ApiPropertyOptional({ description: 'Filter by document IDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documentIds?: string[];

  @ApiPropertyOptional({ description: 'Filter by embedding provider' })
  @IsOptional()
  @IsString()
  provider?: string;
}

export class BatchSearchVectorDto {
  @ApiProperty({ description: 'Array of search queries', type: [SearchVectorDto] })
  @IsArray()
  queries!: SearchVectorDto[];
}

export class VectorSearchResponseDto {
  @ApiProperty()
  queryId!: string;

  @ApiProperty()
  query!: string;

  @ApiProperty()
  provider!: string;

  @ApiProperty()
  topK!: number;

  @ApiProperty()
  latency!: number;

  @ApiProperty({ type: [Object] })
  results!: Array<{
    chunkId: string;
    chunkContent: string;
    score: number;
    fileId: string;
    chunkIndex: number;
    provider: string;
    similarity: number;
    metadata: Record<string, unknown>;
  }>;
}

export class ProviderStatusResponseDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  healthy!: boolean;

  @ApiProperty()
  embeddingModel!: string;

  @ApiProperty()
  embeddingDimensions!: number;
}
