import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ESError } from '../error/es.error';
import dataSourceOptions from '@/db/data-source';

@Injectable()
export class ReindexService {
  private readonly logger = new Logger(ReindexService.name);
  constructor(private readonly esService: ElasticsearchService) {}

  async reindex(indexName: string) {
    await this.ensureIndex(indexName);

    const BATCH_SIZE = 10000;
    const lastId = 0;
    await dataSourceOptions.initialize();
    // tránh SQL injection khi chèn thằng thằng indexName vào câu lệnh
    const tables = await dataSourceOptions.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_type = 'BASE TABLE'
        AND table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_name
    `);
    const tableNames: string[] = tables.map((table: any) => table.table_name);
    if (!tableNames.includes(indexName)) {
      throw new ESError('index name phải trùng với table name DB');
    }
    while (true) {
      // dùng pagination con trỏ
      const rows = await dataSourceOptions.query(
        `SELECT * FROM ${indexName} WHERE id > $1 ORDER BY id ASC LIMIT $2`,
        [lastId, BATCH_SIZE],
      );
      if (rows.length === 0) break;

      await this.bulkIndex(indexName, rows);
    }
    await dataSourceOptions.destroy();
    this.logger.log(`REINDEX ${indexName} thành công`);
  }
  private async ensureIndex(indexName: string): Promise<void> {
    const exists = await this.esService.indices.exists({
      index: indexName,
    });

    if (!exists) {
      await this.esService.indices.create({ index: indexName });
      this.logger.log(`Đã tạo index: ${indexName}`);
    }
  }
  // cho ES tự mapping trước, sau học mapping thì tạo mapping trước rồi mới cho create
  private async bulkIndex(indexName: string, rows: any[]) {
    const operations = rows.flatMap((row) => [
      {
        index: {
          _index: indexName,
          _id: String(row.id), // lấy id của data trong DB làm id trong es luôn
        },
      },
      { ...row },
    ]);
    const result = await this.esService.bulk({
      refresh: false, // nếu là false thì ES sẽ tạo 1 segment (thằng này để lưu data) - để cho có thể search được luôn thay vì đợi bulk xong=> nếu ta đặt false thì đợi bulk xong mới search được
      operations,
    });
    this.logger.log(`reindex bulk ${result.items.length} done`);
    if (result.errors) {
      const failedItems = result.items.filter((item) => item.index?.error);
      throw new ESError(
        `Có ${failedItems.length} lỗi khi bulk index ${JSON.stringify(failedItems.slice(0, 5))}`,
      );
    }
  }
}
