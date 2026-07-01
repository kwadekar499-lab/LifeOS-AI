import { Injectable } from '@nestjs/common';
import { CreateMemoryDto } from '../dto/create-memory.dto';

@Injectable()
export class MemoryValidator {
  validateCreate(dto: CreateMemoryDto): void {
    if (!dto.title || dto.title.trim().length === 0) {
      throw new Error('Title is required');
    }

    if (!dto.content || dto.content.trim().length === 0) {
      throw new Error('Content is required');
    }
  }
}
