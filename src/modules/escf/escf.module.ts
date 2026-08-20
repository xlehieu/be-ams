import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EscfService } from './escf.service';
import { EscfController } from './escf.controller';
import { ReindexService } from './reindex.service';
import { SearchESService } from './searchES.service';
import { SearchESController } from './searchES.controller';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        node: configService.get<string>('ELASTICSEARCH_NODE', 'http://localhost:9200'),
        auth: {
          username: configService.get<string>('ELASTICSEARCH_USERNAME') as string,
          password: configService.get<string>('ELASTICSEARCH_PASSWORD') as string,
        },
        maxRetries: 3,
        requestTimeout: 30000,
      }),
    }),
  ],
  controllers:[EscfController,SearchESController],
  providers:[EscfService,ReindexService,SearchESService],
  exports: [ElasticsearchModule],
})
export class EscfModule {}