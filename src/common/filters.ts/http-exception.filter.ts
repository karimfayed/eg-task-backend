import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpResponse } from '../interfaces/api-response.interface.ts';
import { CustomLogger } from '../logger/custom-logger.service.js';
import { LoggerDto } from '../dtos/logger.dto.js';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLogger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const message =
      typeof exception.getResponse() === 'string'
        ? exception.getResponse()
        : exception.getResponse()['message'];

    const httpResponse: HttpResponse = {
      statusCode: status,
      body: {
        message,
      },
    };

    const lodData: LoggerDto = {
      context: 'Filter',
      error: message,
      method: req.method,
      statusCode: status,
      url: req.originalUrl,
    };

    this.logger.logError(lodData);

    return response.status(status).json(httpResponse);
  }
}
