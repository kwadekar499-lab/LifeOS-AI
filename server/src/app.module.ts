import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/common/health/health.module';
import { PrismaModule } from './modules/database/prisma.module';
import { RedisModule } from './modules/database/redis.module';
import { LoggerModule } from './modules/common/config/logger.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { configValidationSchema } from './config/schema';
import { AuthModule } from './modules/auth/auth.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { AssistantModule } from './modules/assistant/assistant.module';
import { AiModule } from './modules/ai/ai.module';
import { PromptModule } from './modules/prompt/prompt.module';
import { ContextModule } from './modules/context/context.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { ToolsModule } from './modules/tools/tools.module';
import { FilesModule } from './modules/files/files.module';
import { ParserModule } from './modules/parser/parser.module';
import { EmbeddingsModule } from './modules/embeddings/embeddings.module';
import { VectorSearchModule } from './modules/vector-search/vector-search.module';
import { RAGModule } from './modules/rag/rag.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development', '.env.test', '.env.production'],
      validate: (config) => configValidationSchema.parse(config),
      cache: true,
    }),

    // Logging
    LoggerModule,

    // Database
    PrismaModule,
    RedisModule,

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Feature modules
    HealthModule,
    AuthModule,
    ConversationsModule,
    AssistantModule,
    AiModule,
    PromptModule,
    ContextModule,
    KnowledgeModule,
    ToolsModule,
    FilesModule,
    ParserModule,
    EmbeddingsModule,
    VectorSearchModule,
    RAGModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
