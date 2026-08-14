import { dateStringRegex } from '@/common/regex/common.regex';
import { ListQueryDto } from '@/shared/query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsOptional, Matches } from 'class-validator';
import dayjs from 'dayjs';

export class ListQueryAssets extends ListQueryDto {
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 1 })
  asset_category_id: number;

  @IsOptional()
  @ApiPropertyOptional({ example: dayjs().format("YYYY-MM-DD") })
  @Matches(dateStringRegex, {
    message: 'purchase_from_date phải đúng định dạng YYYY-MM-DD',
  })
  purchase_from_date: string;

  @IsOptional()
   @ApiPropertyOptional({ example: dayjs().format("YYYY-MM-DD") })
  @Matches(dateStringRegex, {
    message: 'purchase_to_date phải đúng định dạng YYYY-MM-DD',
  })
  purchase_to_date: string;
}
