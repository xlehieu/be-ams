import { EsExceptionFilter } from '@/filters/es-exeption.filter';
import { HttpExceptionFilter } from '@/filters/http-exception.filter';
import { PostgresExceptionFilter } from '@/filters/postgres-exception.filter';
import { UnknownExceptionFilter } from '@/filters/unknown-exception.filter';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

// thằng filter thứ tự ưu tiên bị đảo ngược => đặt unkown ở đầu để catch những thằng kia trước
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: UnknownExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PostgresExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: EsExceptionFilter,
    },
  ],
})
export class ErrorModule {}
