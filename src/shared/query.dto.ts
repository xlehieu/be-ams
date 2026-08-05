import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, Min } from 'class-validator';

export class ListQueryDto {
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({example:1})
  @Min(1)
  page:number = 1;

  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({example:10})
  @Min(1)
  page_size:number = 10;

  @ApiPropertyOptional({ example: '' })
  @Type(() => String)
  @IsOptional()
  @IsString()
  keyword?: string;

  get offset() {
    return (this.page - 1) * this.page_size;
  }
}
