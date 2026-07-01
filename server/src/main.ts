import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { RequestIdMiddleware } from './modules/common/middleware/request-id.middleware';
import { GlobalExceptionFilter } from './modules/common/filters/global-exception.filter';
import { LoggingInterceptor } from './modules/common/interceptors/logging.interceptor';
import { TransformInterceptor } from './modules/common/interceptors/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import * as Cors from 'cors';
import * as express from 'express';
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

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Get configuration
  const port = configService.get<number>('PORT', 3001);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:5173');
  const swaggerEnabled = configService.get<boolean>('SWAGGER_ENABLED', true);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // Trust proxy (for rate limiting and IP detection behind load balancers)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // Compression
  app.use(compression());

  // CORS
  app.use(
    Cors.default({
      origin: corsOrigin.split(',').map((origin) => origin.trim()),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    })
  );

  // Body size limits
  app.use(express.json({ limit: configService.get<string>('MAX_JSON_PAYLOAD', '5mb') }));
  app.use(express.urlencoded({ limit: configService.get<string>('MAX_REQUEST_SIZE', '10mb'), extended: true }));

  // Request ID middleware (must be before other middleware)
  app.use(RequestIdMiddleware);

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter(configService));

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Enable CORS pre-flight requests
  app.enableCors();

  // Swagger documentation (development only)
  if (swaggerEnabled && nodeEnv === 'development') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(configService.get<string>('SWAGGER_TITLE', 'LifeOS AI API'))
      .setDescription(configService.get<string>('SWAGGER_DESCRIPTION', 'LifeOS AI Backend API Documentation'))
      .setVersion(configService.get<string>('SWAGGER_VERSION', '1.0.0'))
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth'
      )
      .addTag('Health', 'Health check endpoints')
      .addTag('API', 'API endpoints')
      .addTag('Conversations', 'Conversation management endpoints')
      .addTag('Messages', 'Message management endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig, {
      include: [
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
    });
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.log(`Swagger documentation available at http://localhost:${port}/api/docs`);
  }

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.log('SIGTERM received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.log('SIGINT received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  // Start server
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`Environment: ${nodeEnv}`);
  logger.log(`Health check: http://localhost:${port}/health`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
