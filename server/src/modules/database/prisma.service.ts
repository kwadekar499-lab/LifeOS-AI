import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
    });
  }

  async onModuleInit() {
    this.logger.log('Connecting to database...');
    await this.$connect();
    this.logger.log('Database connected successfully');
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from database...');
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  async enableQueryLogging() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).$on('query', (e: { query: string; duration: number }) => {
      this.logger.debug(`Query: ${e.query}`);
      this.logger.debug(`Duration: ${e.duration}ms`);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).$on('error', (e: { message: string }) => {
      this.logger.error(`Database Error: ${e.message}`);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).$on('warn', (e: { message: string }) => {
      this.logger.warn(`Database Warning: ${e.message}`);
    });
  }
}
