import { Public } from '@/decorators/public.decoratetor';
import { Roles } from '@/decorators/role.decoratetor';
import { USER_ROLE } from '@/enums/user-role.enum';
import { Controller, Get, Param, Post } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ReindexService } from './reindex.service';

@Controller('es')
export class EscfController {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly reindexService: ReindexService,
  ) {}

  // GET /es/ping -> kiểm tra nhanh sống/chết
  @Get('ping')
  @Public()
  async ping() {
    const isAlive = await this.esService.ping();
    return {
      connected: isAlive,
      message: isAlive
        ? 'Kết nối Elasticsearch thành công'
        : 'Không kết nối được Elasticsearch',
    };
  }

  // GET /es/info -> version, cluster_name...
  @Get('info')
  @Public()
  async info() {
    return this.esService.info();
  }

  // GET /es/health -> status: green/yellow/red
  @Get('health')
  @Public()
  async health() {
    return this.esService.cluster.health();
  }

  @Get('app-indexes')
  @Roles(USER_ROLE.SYSTEM_CONFIG)
  async getAppIndexes() {
    const res = await this.esService.cat.indices({
      // *, là check ký tự đầu - * là exclude bên trong là những cái sẽ bị exclude
      // bỏ những index có "." ở đầu => chỉ lấy ra tên index mà mình create
      index: '*,-.*',
      h: 'index',
      format: 'json',
    });
    return res;
  }

  @Post('reindex/:indexName')
  @Roles(USER_ROLE.SYSTEM_CONFIG)
  async reindexES(@Param('indexName') indexName: string) {
    await this.reindexService.reindex(indexName);
  }
}
