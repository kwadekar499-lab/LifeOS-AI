import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from '../database/prisma.module';
import { ConversationController } from './controllers/conversation.controller';
import { MessageController } from './controllers/message.controller';
import { ConversationService } from './services/conversation.service';
import { MessageService } from './services/message.service';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { ConversationEventEmitter } from './events/event-emitter.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      maxListeners: 10,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
  ],
  controllers: [ConversationController, MessageController],
  providers: [ConversationService, MessageService, ConversationRepository, MessageRepository, ConversationEventEmitter],
  exports: [ConversationService, MessageService, ConversationRepository, MessageRepository],
})
export class ConversationsModule {}
