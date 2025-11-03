// src/interceptors/http.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface HttpResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
  errors?: any[];
  meta: {
    timestamp: string;
    path: string;
    method: string;
  };
}

@Injectable()
export class HttpInterceptor<T> implements NestInterceptor<T, HttpResponse<T>> {
  private readonly logger = new Logger(HttpInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HttpResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    return next.handle().pipe(
      // Success response transformation
      map((data) => {
        let message = 'Success';
        let responseData = data;

        // Handle custom message
        if (data && typeof data === 'object') {
          if ('message' in data) {
            message = data.message;
          }
          if ('data' in data) {
            responseData = data.data;
          }
        }

        return {
          success: true,
          statusCode: response.statusCode,
          message,
          data: responseData,
          meta: {
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
          },
        };
      }),
      // Error handling
      catchError((error) => {
        this.logger.error(
          `[${request.method}] ${request.url} - Error: ${error.message}`,
          error.stack,
        );

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorName = 'InternalServerError';
        let errors: any[] = [];

        if (error instanceof HttpException) {
          statusCode = error.getStatus();
          const errorResponse = error.getResponse();

          if (typeof errorResponse === 'string') {
            message = errorResponse;
            errorName = error.name;
          } else if (typeof errorResponse === 'object') {
            const errObj = errorResponse as any;
            message = errObj.message || message;
            errorName = errObj.error || error.name;
            errors = Array.isArray(errObj.message) ? errObj.message : [];
          }
        } else {
          message = error.message || message;
          errorName = error.name || errorName;
        }

        const errorResponse: HttpResponse<null> = {
          success: false,
          statusCode,
          message,
          error: errorName,
          ...(errors.length > 0 && { errors }),
          meta: {
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
          },
        };

        response.status(statusCode);
        return throwError(() => new HttpException(errorResponse, statusCode));
      }),
    );
  }
}
