import { dateStringRegex } from '@/common/regex/common.regex';
import { IsDateStringFormat } from '@/decorators/date-string.decorator';
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
  @ApiPropertyOptional({ example: dayjs().format('YYYY-MM-DD') })
  @IsDateStringFormat('purchase_from_date')
  purchase_from_date: string;

  @IsOptional()
  @ApiPropertyOptional({ example: dayjs().format('YYYY-MM-DD') })
  @IsDateStringFormat('purchase_to_date')
  purchase_to_date: string;

  @IsOptional()
  @Type(() => Boolean)
  @ApiPropertyOptional({ example: false })
  current_holder_id: boolean;
}
