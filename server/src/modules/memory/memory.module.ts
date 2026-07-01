import { Module } from '@nestjs/common';
import { MemoryController } from './controllers/memory.controller';
import { MemoryService } from './services/memory.service';
import { MemoryRepository } from './repositories/memory.repository';
import { MemoryEventEmitter } from './events/memory-event-emitter.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  controllers: [MemoryController],
  providers: [MemoryService, MemoryRepository, MemoryEventEmitter],
  imports: [PrismaModule],
  exports: [MemoryService, MemoryRepository],
})
export class MemoryModule {}
