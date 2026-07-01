import { Module, Global } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: Logger,
      useFactory: () => {
        // Configure NestJS logger
        const logger = new Logger();

        return logger;
      },
    },
  ],
  exports: [Logger],
})
export class LoggerModule {}
