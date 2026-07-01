import { Controller, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'healthy' },
            timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            uptime: { type: 'number', example: 12345 },
            checks: {
              type: 'object',
              properties: {
                database: { type: 'string', example: 'healthy' },
                redis: { type: 'string', example: 'healthy' },
              },
            },
          },
        },
      },
    },
  })
  async check() {
    return this.healthService.check();
  }
}
