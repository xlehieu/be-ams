import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Logger } from '@nestjs/common';
import { AssetCategoriesService } from './asset-categories.service';
import { CreateAssetCategoryDto } from './dto/create-asset-category.dto';
import { UpdateAssetCategoryDto } from './dto/update-asset-category.dto';
import { ListQueryDto } from '@/shared/query.dto';
import { Roles } from '@/decorators/role.decoratetor';
import { USER_ROLE } from '@/enums/user-role.enum';

@Controller('asset-categories')
@Roles(USER_ROLE.ADMIN,USER_ROLE.MANAGER)
export class AssetCategoriesController {
  constructor(private readonly assetCategoriesService: AssetCategoriesService) {}

  @Post()
  create(@Body() createAssetCategoryDto: CreateAssetCategoryDto) {
    return this.assetCategoriesService.create(createAssetCategoryDto);
  }

  @Get()
  findAll(@Query() query:ListQueryDto) {
    return this.assetCategoriesService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.assetCategoriesService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAssetCategoryDto: UpdateAssetCategoryDto) {
    return this.assetCategoriesService.update(+id, updateAssetCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.assetCategoriesService.remove(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: number) {
    return this.assetCategoriesService.restore(id);
  }
}
