import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { AssetCategoriesModule } from '../asset-categories/asset-categories.module';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  controllers: [AssetsController],
  providers: [AssetsService],
  imports: [
    TypeOrmModule.forFeature([Asset]),
    AssetCategoriesModule,
    UsersModule,
  ],
})
export class AssetsModule {}
