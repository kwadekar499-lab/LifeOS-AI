import { Injectable } from '@nestjs/common';
import { CreateJournalDto, UpdateJournalDto } from '../dto';

@Injectable()
export class JournalValidator {
  validateCreate(dto: CreateJournalDto): void {
    if (!dto.content || dto.content.trim().length === 0) {
      throw new Error('Content is required');
    }
  }

  validateUpdate(dto: UpdateJournalDto): void {
    if (Object.keys(dto).length === 0) {
      throw new Error('At least one field must be provided for update');
    }
  }
}
