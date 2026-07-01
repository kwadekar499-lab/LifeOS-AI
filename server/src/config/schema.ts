import { z } from 'zod';

export const configValidationSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  API_PREFIX: z.string().default('api/v1'),

  // Security
  JWT_SECRET: z.string().min(32).default('your-secret-key-change-in-production'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('30d'),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(20).default(12),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional().default(''),
  REDIS_DB: z.coerce.number().int().min(0).default(0),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // Rate Limiting
  THROTTLE_TTL: z.coerce.number().int().positive().default(60000),
  THROTTLE_LIMIT: z.coerce.number().int().positive().default(100),

  // Request Size Limits
  MAX_REQUEST_SIZE: z.string().default('10mb'),
  MAX_JSON_PAYLOAD: z.string().default('5mb'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug', 'verbose']).default('info'),

  // Health Check
  HEALTH_CHECK_TIMEOUT: z.coerce.number().int().positive().default(5000),

  // Swagger
  SWAGGER_ENABLED: z.coerce.boolean().default(true),
  SWAGGER_TITLE: z.string().default('LifeOS AI API'),
  SWAGGER_DESCRIPTION: z.string().default('LifeOS AI Backend API Documentation'),
  SWAGGER_VERSION: z.string().default('1.0.0'),

  // AI Gateway
  AI_DEFAULT_PROVIDER: z.string().default('mock'),
  AI_REQUEST_TIMEOUT: z.coerce.number().int().positive().default(30000),
  AI_RETRY_COUNT: z.coerce.number().int().min(0).max(5).default(1),
  AI_STREAMING_ENABLED: z.coerce.boolean().default(true),
  AI_MODEL_OVERRIDES: z.string().optional(),
});

export type ConfigSchema = z.infer<typeof configValidationSchema>;
