// common/interceptors/response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpResponse } from '../interfaces/api-response.interface.ts';
import { STATUS_CODES } from 'http';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const statusMessage =
          STATUS_CODES[statusCode] || 'No Message Available';

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
