// unknown-exception.filter.ts
import { ESError } from '@/modules/error/es.error';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(ESError)
export class EsExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger("Elasticsearch Error");

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(
      `Elastic exception: ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception),
    );
    return response.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Lỗi hệ thống',
    });
  }
}
