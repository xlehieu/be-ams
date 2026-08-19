import { dateStringRegex } from '@/common/regex/common.regex';
import { applyDecorators } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';

export function IsDateStringFormat(fieldName?:string) {
  return applyDecorators(
    IsString(),
    Matches(dateStringRegex, {
      message: fieldName ?`${fieldName} phải đúng định dạng YYYY-MM-DD`:'Field phải đúng định dạng YYYY-MM-DD',
    }),
  );
}
