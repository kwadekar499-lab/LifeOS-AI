import { IsNotEmpty, IsString } from 'class-validator';

export class ParseDocumentDto {
  @IsNotEmpty()
  @IsString()
  fileId: string;
}
