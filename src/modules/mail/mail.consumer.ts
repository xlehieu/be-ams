// mail/mail-consumer.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../kafka/consumer.service';
import { MailService } from './mail.service';

@Injectable()
export class MailConsumer implements OnModuleInit {
private readonly logger = new Logger(MailConsumer.name)
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly mailService: MailService,
  ) {}

  async onModuleInit() {
    await this.consumerService.ensureTopics(['register-success']);
    await this.consumerService.consume(
      { topics: ['register-success'] },
      {
        eachMessage: async ({topic,message }) => {
          try {
            const data = JSON.parse(message.value?.toString() ?? '{}');
            await this.mailService.senEmailWelcome(data,topic);
          } catch (err) {
            this.logger.error('Failed to process mail message', err);
          }
        },
      },
    );
  }
}