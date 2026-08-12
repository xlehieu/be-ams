import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

// chỉ catch những error nào là QueryFailedError
@Catch(QueryFailedError)
export class PostgresExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PostgresExceptionFilter.name);
  catch(
    exception: QueryFailedError & {
      code?: string;
      detail?: string;
    },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message } = this.mapPostgresError(exception);
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception),
    );
    return response.status(status).json({
      success: false,
      statusCode: status,
      message,
    });
  }

  private mapPostgresError(exception: any): {
    status: number;
    message: string;
  } {
    switch (exception.code) {
      case '23505': // unique_violation
        return { status: HttpStatus.CONFLICT, message: 'Dữ liệu đã tồn tại' };
      case '23503': // foreign_key_violation
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Dữ liệu tham chiếu không tồn tại',
        };
      case '23502': // not_null_violation
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `Thiếu dữ liệu bắt buộc: ${exception.column}`,
        };
      case '22P02': // invalid_text_representation (sai kiểu dữ liệu)
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Dữ liệu không đúng định dạng',
        };
      case '08006':
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Connection db timeout',
        };
      case '42P01': // undefined_table
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Lỗi cấu hình hệ thống (table không tồn tại)',
        };
      case '42703': // undefined_column
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Lỗi cấu hình hệ thống (column không tồn tại)',
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Lỗi truy vấn cơ sở dữ liệu',
        };
    }
  }
}
