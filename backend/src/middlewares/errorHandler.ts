import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { AppError } from '../utils/errorFormatter';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  console.error('Unhandled error:', err.message);

  if (env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    error: err.message || 'Internal server error',
  });
}
