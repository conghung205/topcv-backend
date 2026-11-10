import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  { success: boolean; message: string; data: T }
> {
  constructor(private readonly reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<{ success: boolean; message: string; data: T }> {
    const message = this.reflector.get<string>(
      'response_message',
      context.getHandler(),
    );

    return next.handle().pipe(
      // if success
      map((data) => ({
        success: true,
        message: message,
        data,
      })),

      //   if it fails
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}
