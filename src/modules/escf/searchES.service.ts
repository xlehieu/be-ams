import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ESError } from '../error/es.error';
import { SearchESQueryDto } from './dto/search.dto';
import { buildPagination } from '@/shared/buildPagination';



@Injectable()
export class SearchESService {
  private readonly logger = new Logger(SearchESService.name);

  constructor(private readonly esService: ElasticsearchService) {}

  async searchES<T = any>(indexName:string,options: SearchESQueryDto) {
    const {
      keyword,
      searchFields = ['name'],
      page = 1,
      page_size = 20,
      offset
    } = options;

    const must: any[] = [];
    const filter: any[] = [];

    // 1. full-text search (nếu có keyword)
    if (keyword && keyword.trim()) {
      must.push({
        multi_match: {
          query: keyword.trim(),
          fields: searchFields,
          operator: 'or', // sau đổi thành and
        },
      });
    }


    const query =
      must.length === 0 && filter.length === 0
        ? { match_all: {} }
        : { bool: { must, filter } };


    try {
      const response = await this.esService.search<T>({
        index:indexName,
        query,
        from:offset,
        size: page_size,
      });

      const total =
        typeof response.hits.total === 'number'
          ? response.hits.total
          : (response.hits.total?.value ?? 0);

      const items = response.hits.hits.map((hit) => ({
        ...(hit._source as any),
        _score: hit._score,
      }));
      return buildPagination(items,total,page,page_size)
    } catch (err: any) {
      this.logger.error(`Search lỗi trên index "${indexName}": ${err.message}`);
      throw new ESError(`Không thể search trên index "${indexName}"`);
    }
  }

  /** Tìm 1 document theo id */
  async getById<T = any>(index: string, id: string): Promise<T | null> {
    try {
      const response = await this.esService.get<T>({ index, id });
      return response._source ?? null;
    } catch (err: any) {
      if (err.meta?.statusCode === 404) return null;
      this.logger.error(`getById lỗi trên index "${index}": ${err.message}`);
      throw new ESError(`Không thể lấy document id="${id}" trên index "${index}"`);
    }
  }
}

const sampleSearch ={
  "query": {
    // bool để kết hợp nhiều query với nhau
    "bool": {
      "must": [
        // điều kiện và
        {
          "multi_match": {
            "query": "ke toan",
            "fields": ["name", "description"],
            "fuzziness": "AUTO",
            "operator": "or"
          }
        }
      ],
      "filter": [
        { "term": { "status": "active" } },

        { "terms": { "category.keyword": ["electronics", "phones"] } },

        { "term": { "isActive": true } },

        { "range": { "price": { "gte": 100, "lte": 500 } } },

        { "range": { "createdAt": { "gte": "2026-01-01", "lte": "2026-12-31" } } }
      ],
      "must_not": [
        { "term": { "status": "deleted" } }
      ]
    }
  },
  "sort": [
    { "price": { "order": "asc" } },
    { "createdAt": { "order": "desc" } },
    { "_score": { "order": "desc" } }
  ],
  "from": 0,
  "size": 20
}

// match	Full-text search 1 field
// multi_match	Full-text search nhiều field cùng lúc
// term	So khớp chính xác 1 giá trị
// terms	So khớp chính xác nhiều giá trị (OR)
// range	Lọc khoảng (số, ngày)
// bool	Kết hợp nhiều điều kiện (must, filter, should, must_not)
// wildcard	Tìm theo pattern có *, ?
// match_all	Lấy tất cả, không điều kiện
// exists	Kiểm tra field có tồn tại/có giá trị không
// prefix	Tìm theo tiền tố (bắt đầu bằng...)