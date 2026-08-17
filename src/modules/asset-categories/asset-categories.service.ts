import { buildPagination } from '@/shared/buildPagination';
import { ListQueryDto } from '@/shared/query.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import { CreateAssetCategoryDto } from './dto/create-asset-category.dto';
import { UpdateAssetCategoryDto } from './dto/update-asset-category.dto';
import { AssetCategory } from './entities/asset-category.entity';
import { buildAndWhereQueryBuilder } from '@/common/typeorm/query-builder';

@Injectable()
export class AssetCategoriesService {
  constructor(
    @InjectRepository(AssetCategory)
    private readonly assetCategoryRepository: Repository<AssetCategory>,

    private readonly redisService: RedisService,
  ) {}
  async create(dto: CreateAssetCategoryDto) {
    const existed = await this.assetCategoryRepository.findOne({
      where: [
        {
          asset_category_code: dto.asset_category_code,
        },
        {
          asset_category_name: dto.asset_category_name,
        },
      ],
    });
    if (existed) {
      throw new BadRequestException('Mã hoặc tên danh mục đã tồn tại');
    }

    const assetCategory = this.assetCategoryRepository.create(dto);

    return await this.assetCategoryRepository.save(assetCategory);
  }

  async findAll(query: ListQueryDto) {
    const { offset, page, page_size, keyword } = query;
    const cacheKey = [AssetCategory.name, 'list', query];
    const cacheData = await this.redisService.get<AssetCategory[]>(cacheKey);
    if (cacheData) {
      return cacheData;
    }
    // tên asset_category phải giống tên với bên trong query builder
    const qb = buildAndWhereQueryBuilder(this.assetCategoryRepository, {
      alias: 'asset_category',
      queryList: [
        {
          key: ['asset_category_name', 'asset_category_code'],
          operatorCf: 'ilike',
          paramName: 'keyword',
          value: keyword,
        },
      ],
    });
    qb.orderBy('asset_category.updated_at', 'DESC')
      .addOrderBy('asset_category.id', 'DESC')
      .skip(offset)
      .take(page_size);

    const [data, total] = await qb.getManyAndCount();
    const result = buildPagination(data, total, page, page_size);
    await this.redisService.set(cacheKey, result);
    return result;
  }

  async findById(id: number) {
    const cacheKey = [AssetCategory.name, 'detail', id];
    const cacheData = await this.redisService.get<AssetCategory>(cacheKey);
    if (cacheData) {
      return cacheData;
    }
    const assetCategory = await this.assetCategoryRepository.findOne({
      where: { id },
    });

    if (!assetCategory) {
      throw new NotFoundException('Không tìm thấy danh mục tài sản');
    }

    return assetCategory;
  }
  async update(id: number, dto: UpdateAssetCategoryDto) {
    const assetCategory = await this.assetCategoryRepository.findOne({
      where: { id },
    });
    if (!assetCategory) throw new NotFoundException();
    Object.assign(assetCategory, dto);
    return await this.assetCategoryRepository.save(assetCategory);
  }

  async remove(id: number) {
    const result = await this.assetCategoryRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return {
      message: 'Xóa danh mục thành công',
    };
  }
  async restore(id: number) {
    const result = await this.assetCategoryRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return {
      message: 'Khôi phục danh mục mục thành công',
    };
  }
}
