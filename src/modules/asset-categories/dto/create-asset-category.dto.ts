import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAssetCategoryDto {
  @ApiProperty({
    description: 'Mã danh mục tài sản',
    example: 'LAPTOP',
  })
  @IsString({ message: 'Mã danh mục phải là một chuỗi' })
  @IsNotEmpty({ message: 'Mã danh mục không được để trống' })
  asset_category_code: string;

  @ApiProperty({
    description: 'Tên danh mục tài sản',
    example: 'Máy tính xách tay',
  })
  @IsString({ message: 'Tên danh mục phải là một chuỗi' })
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  asset_category_name: string;

  @ApiPropertyOptional({
    description: 'ID của danh mục cha',
    example: 1,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'ID danh mục cha phải là số nguyên' })
  parent_id?: number;

  @ApiPropertyOptional({
    description: 'Thời gian khấu hao (tháng)',
    example: 36,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Thời gian khấu hao phải là số nguyên' })
  useful_life_months?: number;
}