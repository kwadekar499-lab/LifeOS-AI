import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { RequestWithId } from '../middleware/request-id.middleware';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    requestId?: string;
    details?: any;
  };
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithId>();
    const requestId = request.requestId;

    let status: number;
    let code: string;
    let message: string;
    let details: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        code = this.getErrorCode(status);
        message = (exceptionResponse as any).message || exception.message;
        details = (exceptionResponse as any).message;
      } else {
        code = this.getErrorCode(status);
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = 'INTERNAL_SERVER_ERROR';
      message =
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'An unexpected error occurred'
          : exception.message;
      details = this.configService.get<string>('NODE_ENV') === 'production' ? undefined : exception.stack;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = 'UNKNOWN_ERROR';
      message = 'An unknown error occurred';
    }

    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message,
        requestId,
        ...(details && { details }),
      },
    };

    // Log error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${code} - ${message}`,
      exception instanceof Error ? exception.stack : undefined
    );

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'UNPROCESSABLE_ENTITY';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'TOO_MANY_REQUESTS';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'INTERNAL_SERVER_ERROR';
      case HttpStatus.SERVICE_UNAVAILABLE:
        return 'SERVICE_UNAVAILABLE';
      default:
        return 'HTTP_ERROR';
    }
  }
}
