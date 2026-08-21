import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../kafka/consumer.service';
import { ReindexService } from './reindex.service';

@Injectable()
export class ReindexConsumer implements OnModuleInit {
  private readonly logger = new Logger(ReindexConsumer.name);
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly reindexService: ReindexService,
  ) {}
  async onModuleInit() {
    await this.consumerService.ensureTopics(['reindexES']);
    await this.consumerService.consume(
      {
        topics: ['reindexES'],
      },
      {
        eachMessage: async ({ topic, message }) => {
          try {
            const data = JSON.parse(message.value?.toString() ?? '{}');
            await this.reindexService.reindex(data.aliasName, data.mappings);
          } catch (err) {
            this.logger.error(`ERROR CONSUMER: ${topic}`, err);
          }
        },
      },
    );
  }
}
