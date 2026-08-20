// search.dto.ts
import { ListQueryDto } from '@/shared/query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class SearchESQueryDto extends ListQueryDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((v) => v.trim()) : value,
  )
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional()
  searchFields?: string[];
}
