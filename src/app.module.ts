import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetCategoriesModule } from './modules/asset-categories/asset-categories.module';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { ErrorModule } from './modules/error/error.module';
import { EscfModule } from './modules/escf/escf.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { MailModule } from './modules/mail/mail.module';
import { RedisModule } from './modules/redis/redis.module';
import { UsersModule } from './modules/users/users.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // dùng ConfigService ở mọi module không cần import lại
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize:
          configService.get<string>('NODE_ENV') === 'development'
            ? true
            : false,
        // logging: true,
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    UsersModule,
    DepartmentsModule,
    AssetCategoriesModule,
    RedisModule,
    KafkaModule,
    MailModule,
    EscfModule,
    ErrorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
