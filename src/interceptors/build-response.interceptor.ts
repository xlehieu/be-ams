// logging.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BuildResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response  = context.switchToHttp().getResponse()

    return next.handle().pipe(
     map((data) => ({
        message: data?.message || 'Thao tác thành công',
        statusCode: response.statusCode,
        data: data?.data !== undefined ? data.data : data,
        pagination: data?.pagination || undefined,
        meta: data?.meta || undefined,
      })),
    );
  }
}