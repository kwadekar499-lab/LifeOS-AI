import { Module } from '@nestjs/common';
import { ParserController } from './controllers/parser.controller';
import { ParserService } from './services/parser.service';
import { ParserRegistry } from './registry/parser-registry.service';
import { SemanticChunkerService } from './chunking/semantic-chunker.service';
import { DocumentRepository } from './repositories/document.repository';
import { ParserEventEmitterService } from './events/parser-event-emitter.service';
import { TextParser } from './parsers/text-parser.service';
import { MarkdownParser } from './parsers/markdown-parser.service';
import { PdfParser } from './parsers/pdf-parser.service';
import { DocxParser } from './parsers/docx-parser.service';
import { PrismaModule } from '../database/prisma.module';
import { FilesModule } from '../files/files.module';

@Module({
  controllers: [ParserController],
  providers: [
    ParserService,
    ParserRegistry,
    SemanticChunkerService,
    DocumentRepository,
    ParserEventEmitterService,
    TextParser,
    MarkdownParser,
    PdfParser,
    DocxParser,
  ],
  imports: [PrismaModule, FilesModule],
  exports: [ParserService, ParserRegistry],
})
export class ParserModule {}
