import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateEmbeddingDto {
  @ApiProperty({ description: 'Chunk IDs to generate embeddings for', required: false })
  @IsOptional()
  @IsString({ each: true })
  chunkIds?: string[];
}

export class ChunkEmbeddingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  chunkId: string;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  dimensions: number;

  @ApiProperty({ nullable: true })
  tokenCount: number | null;

  @ApiProperty({ nullable: true })
  latencyMs: number | null;

  @ApiProperty()
  costEstimate: number;

  @ApiProperty()
  createdAt: Date;
}

export class ProviderStatusDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  dimensions: number;

  @ApiProperty()
  healthy: boolean;
}
