import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAssetDto {
  @ApiProperty({
    description: 'Mã tài sản',
    example: 'TS-0001',
  })
  @IsString({ message: 'Mã tài sản phải là chuỗi' })
  asset_code: string;

  @ApiPropertyOptional({
    description: 'Mã QR của tài sản',
    example: 'QR-0001',
  })
  @IsOptional()
  @IsString({ message: 'Mã QR phải là chuỗi' })
  qr_code: string;

  @ApiProperty({
    description: 'Tên tài sản',
    example: 'Laptop Dell XPS 15',
  })
  @IsString({ message: 'Tên tài sản phải là chuỗi' })
  asset_name: string;

  @ApiPropertyOptional({
    description: 'ID danh mục tài sản',
    example: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'ID danh mục tài sản phải là số' })
  asset_category_id: number;

  @ApiPropertyOptional({
    description: 'Số serial của tài sản',
    example: 'SN-1234567890',
  })
  @IsOptional()
  @IsString({ message: 'Số serial phải là chuỗi' })
  serial_number: string;

  @ApiPropertyOptional({
    description: 'Ngày mua tài sản, định dạng YYYY-MM-DD',
    example: '2026-08-14',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày mua không hợp lệ' })
  purchase_date?: Date;

  @ApiPropertyOptional({
    description: 'Giá mua tài sản',
    example: 15000000,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Giá mua phải là số' })
  purchase_price?: number;
}