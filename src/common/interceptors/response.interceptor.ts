// common/interceptors/response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpResponse } from '../interfaces/api-response.interface.ts';
import { STATUS_CODES } from 'http';
import { CustomLogger } from '../logger/custom-logger.service.js';
import { LoggerDto } from '../dtos/logger.dto.js';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  // private readonly logger = new Logger(ResponseInterceptor.name);
  constructor(private readonly logger: CustomLogger) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.originalUrl;
    const start = Date.now();
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const statusMessage =
          STATUS_CODES[statusCode] || 'No Message Available';

        const duration = Date.now() - start;

        const logData: LoggerDto = {
          context: 'Interceptor',
          method,
          url,
          statusCode,
          duration,
        };

        this.logger.logRequest(logData);

        const httpResponse: HttpResponse<T> = {
          statusCode: statusCode,
          body: {
            message: statusMessage,
            result: data,
          },
        };
        return httpResponse;
      }),
    );
  }
}
