import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse> {
    const request = context.switchToHttp().getRequest();
    const requestId = request.requestId;

    return next.handle().pipe(
      map((data) => {
        const apiResponse: ApiResponse = {
          success: true,
          data,
          meta: {
            timestamp: new Date().toISOString(),
            requestId,
          },
        };

        // Add pagination metadata if present
        if (data && typeof data === 'object' && 'total' in data && 'page' in data) {
          apiResponse.meta!.pagination = {
            page: data.page,
            limit: data.limit,
            total: data.total,
            totalPages: Math.ceil(data.total / data.limit),
          };
          if (apiResponse.data && typeof apiResponse.data === 'object') {
            const dataObj = apiResponse.data as Record<string, unknown>;
            delete dataObj.total;
            delete dataObj.page;
            delete dataObj.limit;
          }
        }

        return apiResponse;
      })
    );
  }
}
