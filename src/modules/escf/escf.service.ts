// src/departments/departments-search.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class EscfService {
  private readonly logger = new Logger(EscfService.name);
  constructor(private readonly esService: ElasticsearchService) {}
  
}