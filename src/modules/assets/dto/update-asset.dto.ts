import { ASSET_STATUS } from '@/enums/asset-status.enum';
import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateAssetDto } from './create-asset.dto';

export class UpdateAssetDto extends PartialType(CreateAssetDto) {
  @IsOptional()
  @IsEnum(ASSET_STATUS, { message: 'Trạng thái tài sản không hợp lệ' })
  status?: ASSET_STATUS;
}
