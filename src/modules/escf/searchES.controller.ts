// search.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchESService } from './searchES.service';
import { SearchESQueryDto } from './dto/search.dto';

@ApiTags('Search')
@Controller('searchES')
export class SearchESController {
  constructor(private readonly searchService: SearchESService) {}

  @Get(':indexName')
  @ApiOperation({ summary: 'Tìm kiếm document trong 1 index (alias)' })
  async search(
    @Param('indexName') indexName: string,
    @Query() query: SearchESQueryDto,
  ) {
    return this.searchService.searchES(indexName, query);
  }
}
