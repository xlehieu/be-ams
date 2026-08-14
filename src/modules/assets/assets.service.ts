import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetCategoriesService } from '../asset-categories/asset-categories.service';
import { AssetCategory } from '../asset-categories/entities/asset-category.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';
import { ListQueryAssets } from './dto/query-asset.dto';
import { RedisService } from '../redis/redis.service';
import { buildPagination } from '@/shared/buildPagination';
import { buildAndWhereQueryBuilder } from '@/common/typeorm/query-builder';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    private readonly assetCategoriesService: AssetCategoriesService,
    private readonly redisService: RedisService,

    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
  ) {}
  async findAll(query: ListQueryAssets) {
    const {
      offset,
      page_size,
      keyword,
      asset_category_id,
      purchase_from_date,
      purchase_to_date,
    } = query;
    const cacheKey = [Asset.name, 'list', query];
    const cacheData = await this.redisService.get(cacheKey);
    if (cacheData) {
      return cacheData;
    }
    const qb = buildAndWhereQueryBuilder(this.assetRepository, {
      alias: 'asset',
      queryList: [
        {
          key: ['asset_code', 'asset_name'],
          operatorCf: 'ilike',
          param_name: 'keyword',
          value: keyword,
        },
        {
          key: 'asset_category_id',
          operatorCf: 'eq',
          param_name: 'asset_category_id',
          value: asset_category_id,
        },
        {
          key: 'purchase_date',
          operatorCf: 'compare_date',
          param_name: 'purchase_date',
          value: [purchase_from_date, purchase_to_date],
        },
      ],
    });
    qb.orderBy('asset.updated_at', 'DESC')
      .addOrderBy('asset.id', 'DESC')
      .skip(offset)
      .take(page_size);

    const [data, total] = await qb.getManyAndCount();
    const result = buildPagination(data, total, query.page, query.page_size);
    await this.redisService.set(cacheKey, result);
    return result;
  }
  async create(createAssetDto: CreateAssetDto) {
    const { asset_category_id } = createAssetDto;

    let assetCategory: AssetCategory | null = null;

    if (asset_category_id) {
      assetCategory =
        await this.assetCategoriesService.findById(asset_category_id);

      if (!assetCategory) {
        throw new NotFoundException(`Không tìm thấy danh mục tài sản`);
      }
    }
    const asset = this.assetRepository.create(createAssetDto);
    await this.redisService.bumpVersionScope(Asset.name);
    return this.assetRepository.save(asset);
  }

  async update(id: number, updateAssetDto: UpdateAssetDto) {
    const { asset_category_id } = updateAssetDto;

    let assetCategory: AssetCategory | null = null;
    const asset = await this.assetRepository.findOneBy({
      id,
    });
    if (!asset) {
      throw new NotFoundException('Không tìm thấy tài sản');
    }
    if (asset_category_id && asset_category_id !== asset.asset_category_id) {
      assetCategory =
        await this.assetCategoriesService.findById(asset_category_id);

      if (!assetCategory) {
        throw new NotFoundException(`Không tìm thấy danh mục tài sản`);
      }
    }
    Object.assign(asset, updateAssetDto);
    await this.redisService.bumpVersionScope(Asset.name);
    return this.assetRepository.save(asset);
  }
  async remove(id: number) {
    const result = await this.assetRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return {
      message: 'Xóa user thành công',
    };
  }
  async restore(id: number) {
    const result = await this.assetRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    await this.redisService.bumpVersionScope(Asset.name);
    return {
      message: 'Xóa user thành công',
    };
  }
}
