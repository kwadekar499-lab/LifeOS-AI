import { Module } from '@nestjs/common';
import { JournalController } from './controllers/journal.controller';
import { JournalService } from './services/journal.service';
import { JournalRepository } from './repositories/journal.repository';
import { JournalEventEmitter } from './events/journal-event-emitter.service';
import { JournalValidator } from './validators/journal.validator';
import { PrismaModule } from '../database/prisma.module';

@Module({
  controllers: [JournalController],
  providers: [JournalService, JournalRepository, JournalEventEmitter, JournalValidator],
  imports: [PrismaModule],
  exports: [JournalService],
})
export class JournalModule {}
