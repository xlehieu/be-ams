import { Public } from '@/decorators/public.decoratetor';
import { Controller, Get } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Controller('es')
@Public()
export class EscfController {
  constructor(private readonly esService: ElasticsearchService) {}

  // GET /es/ping -> kiểm tra nhanh sống/chết
  @Get('ping')
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
  async info() {
    return this.esService.info();
  }

  // GET /es/health -> status: green/yellow/red
  @Get('health')
  async health() {
    return this.esService.cluster.health();
  }
}