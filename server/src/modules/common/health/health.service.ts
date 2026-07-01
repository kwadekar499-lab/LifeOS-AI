import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../database/redis.service';
import { ConfigService } from '@nestjs/config';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    database: 'healthy' | 'unhealthy';
    redis: 'healthy' | 'unhealthy';
  };
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private startTime: number;

  constructor(
    private prismaService: PrismaService,
    private redisService: RedisService,
    private configService: ConfigService
  ) {
    this.startTime = Date.now();
  }

  async check(): Promise<HealthCheckResult> {
    const checks = {
      database: 'unhealthy' as 'healthy' | 'unhealthy',
      redis: 'unhealthy' as 'healthy' | 'unhealthy',
    };

    // Check database connectivity
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      checks.database = 'healthy';
    } catch (error) {
      this.logger.error('Database health check failed', error);
      checks.database = 'unhealthy';
    }

    // Check Redis connectivity
    try {
      await this.redisService.ping();
      checks.redis = 'healthy';
    } catch (error) {
      this.logger.error('Redis health check failed', error);
      checks.redis = 'unhealthy';
    }

    const isHealthy = checks.database === 'healthy' && checks.redis === 'healthy';

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      checks,
    };
  }
}
