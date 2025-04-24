// common/logger/custom-logger.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { LoggerDto } from '../dtos/logger.dto';

@Injectable()
export class CustomLogger extends Logger {
  logRequest(data: LoggerDto) {
    const { context, duration, method, statusCode, url } = data;
    this.log(`[${context}] ${method} ${url} → ${statusCode} in ${duration}ms`);
  }

  logError(data: LoggerDto) {
    const { context, error, method, statusCode, url } = data;
    this.error(`[${context}] ${method} ${url} → ${statusCode} - ${error}`);
  }
}
