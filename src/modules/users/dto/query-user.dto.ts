import { ListQueryDto } from '@/shared/query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ListQueryUsers extends ListQueryDto {
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 1 })
  department_id: number;
}
