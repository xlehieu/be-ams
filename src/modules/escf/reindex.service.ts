import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ESError } from '../error/es.error';
import dataSourceOptions from '@/db/data-source';

const BATCH_SIZE = 10000;

@Injectable()
export class ReindexService {
  private readonly logger = new Logger(ReindexService.name);

  constructor(private readonly esService: ElasticsearchService) {}

  async reindex(aliasName: string, mappings: Record<string, any> = {}) {
    await this.validateTableExists(aliasName);

    // tạo lại index mới khi muốn làm lại mapping, không put mapping vào index nữa
    const newIndex = `${aliasName}_v${Date.now()}`;
    await this.createIndex(newIndex, mappings);

    let dbCount = 0;
    try {
      dbCount = await this.loadDataFromDb(aliasName, newIndex);
    } catch (err) {
      // bulk lỗi giữa chừng -> dọn index rác, không switch alias
      await this.esService.indices.delete({ index: newIndex }).catch(() => {});
      throw err;
    }

    await this.verifyCount(newIndex, dbCount);
    await this.switchAlias(aliasName, newIndex);

    this.logger.log(
      `REINDEX ${aliasName}: ${dbCount} records thành công -> ${newIndex}`,
    );
  }
  async reindexNoMapping(aliasName: string) {}
  // check xem db có table này không=> table sẽ trùng với thằng alias không cho trùng tên index nữa
  private async validateTableExists(tableName: string): Promise<void> {
    const initialized = dataSourceOptions.isInitialized;
    if (!initialized) await dataSourceOptions.initialize();

    const tables = await dataSourceOptions.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_type = 'BASE TABLE'
        AND table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_name
    `);
    const tableNames: string[] = tables.map((t: any) => t.table_name);

    if (!tableNames.includes(tableName)) {
      throw new ESError('index name phải trùng với table name DB');
    }
  }

  private async createIndex(indexName: string, mappings: Record<string, any>) {
    await this.esService.indices.create({
      index: indexName,
      body: {
        //es tự dynamic mapping, => lấy data từ db và tự tạo mapping luôn
        mappings,
        settings: {
          number_of_replicas: 0, // tắt replica lúc bulk để tăng tốc
          refresh_interval: '-1', // tắt refresh tự động lúc bulk
          analysis: {
            filter: {
              vi_ascii_folding: {
                type: 'asciifolding', // loại filter: bỏ dấu
                preserve_original: true, // giữ cả bản có dấu lẫn không dấu
              },
            },
            analyzer: {
              vi_analyzer: {
                type: 'custom',
                tokenizer: 'standard', // bước 1: tách câu thành từng từ
                filter: ['lowercase', 'vi_ascii_folding'],// bước 2, 3: chạy lần lượt các filter
              },
            },
          },
        },
      },
    });
    this.logger.log(`Đã tạo index mới: ${indexName}`);
  }

  private async loadDataFromDb(
    tableName: string,
    targetIndex: string,
  ): Promise<number> {
    let lastId = 0;
    let total = 0;

    try {
      while (true) {
        //paigination cursor cho nhanh
        const rows = await dataSourceOptions.query(
          `SELECT * FROM ${tableName} WHERE id > $1 ORDER BY id ASC LIMIT $2`,
          [lastId, BATCH_SIZE],
        );
        if (rows.length === 0) break;

        await this.bulkIndex(targetIndex, rows);
        lastId = rows[rows.length - 1].id;
        total += rows.length;
      }
    } finally {
      await dataSourceOptions.destroy().catch(() => {});
      // bật lại refresh + replica sau khi bulk xong
      await this.esService.indices.putSettings({
        index: targetIndex,
        body: {
          refresh_interval: '1s',
          number_of_replicas: 1,
        },
      });
    }

    return total;
  }

  private async bulkIndex(indexName: string, rows: any[]) {
    const operations = rows.flatMap((row) => [
      { index: { _index: indexName, _id: String(row.id) } },
      { ...row },
    ]);

    const result = await this.esService.bulk({ refresh: false, operations });

    if (result.errors) {
      const failedItems = result.items.filter((item) => item.index?.error);
      throw new ESError(
        `Có ${failedItems.length} lỗi khi bulk index ${JSON.stringify(failedItems.slice(0, 5))}`,
      );
    }

    this.logger.log(`bulk ${rows.length} records vào ${indexName} thành công`);
  }

  private async verifyCount(indexName: string, expectedCount: number) {
    // cần refresh thủ công vì lúc bulk đã tắt refresh_interval
    await this.esService.indices.refresh({ index: indexName });

    const { count } = await this.esService.count({ index: indexName });
    if (count !== expectedCount) {
      throw new ESError(
        `Số lượng lệch sau khi bulk: DB=${expectedCount}, ES=${count}, huỷ switch alias`,
      );
    }
  }

  private async switchAlias(aliasName: string, newIndex: string) {
    let oldIndex: string | null = null;

    const aliasExists = await this.esService.indices.existsAlias({
      name: aliasName,
    });
    if (aliasExists) {
      const aliasInfo = await this.esService.indices.getAlias({
        name: aliasName,
      });
      oldIndex = Object.keys(aliasInfo)[0];
    }

    await this.esService.indices.updateAliases({
      body: {
        actions: [
          // nếu chưa có oldIndex thì không switch
          ...(oldIndex
            ? [{ remove: { index: oldIndex, alias: aliasName } }]
            : []),
          { add: { index: newIndex, alias: aliasName } },
        ],
      },
    });
    this.logger.log(`Alias "${aliasName}" đã chuyển sang "${newIndex}"`);

    if (oldIndex && oldIndex !== newIndex) {
      await this.esService.indices.delete({ index: oldIndex });
      this.logger.log(`Đã xoá index cũ: ${oldIndex}`);
    }
  }
}
