export interface LoggerDto {
  context: string;
  method: string;
  url: string;
  statusCode: number;
  duration?: number;
  error?: string;
}
