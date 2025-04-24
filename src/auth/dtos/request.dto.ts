import { Request } from 'express';

export interface RequestDto extends Request {
  userId: string;
}
