export class StreamChunkDto {
  content!: string;
  requestId!: string;
  provider!: string;
  model!: string;
  done!: boolean;
  tokenIndex!: number;
}
