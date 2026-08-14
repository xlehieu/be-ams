import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ListQueryAssets } from './dto/query-asset.dto';
import { Roles } from '@/decorators/role.decoratetor';
import { USER_ROLE } from '@/enums/user-role.enum';

@Controller('assets')
@Roles(USER_ROLE.ADMIN)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.create(createAssetDto);
  }

  @Get()
  findAll(@Query() query: ListQueryAssets) {
    return this.assetsService.findAll(query);
  }

  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.assetsService(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetsService.update(+id, updateAssetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.assetsService.remove(+id);
  }
}
