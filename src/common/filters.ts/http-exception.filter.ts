import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpResponse } from '../interfaces/api-response.interface.ts';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const message = exception.getResponse();

    const httpResponse: HttpResponse = {
      statusCode: status,
      body: {
        message: typeof message === 'string' ? message : message['message'],
      },
    };

    return response.status(status).json(httpResponse);
  }
}
