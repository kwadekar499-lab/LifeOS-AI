import { Module } from '@nestjs/common';
import { FileController } from './controllers/file.controller';
import { FileService } from './services/file.service';
import { FileRepository } from './repositories/file.repository';
import { LocalStorageProvider } from './providers/local-storage.provider';
import { FileValidator } from './validators/file.validator';
import { FileEventEmitter } from './events/file-event-emitter.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  controllers: [FileController],
  providers: [FileService, FileRepository, LocalStorageProvider, FileValidator, FileEventEmitter],
  imports: [PrismaModule],
  exports: [FileService, FileRepository],
})
export class FilesModule {}
