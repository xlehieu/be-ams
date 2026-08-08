import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit {
  private readonly kafka: Kafka;
  private readonly producer: Producer;

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      brokers: [
        ...(this.configService.get<string>('KAFKA_BROKERS')?.split(',') ?? []),
      ],
    });
    this.producer = this.kafka.producer();
  }
  // producer để gửi message/event vào kafka
  async onModuleInit() {
    this.producer.connect();
  }
  async produce(record: ProducerRecord) {
    this.producer.send(record);
  }
  async onApplicationShutdown() {
    this.producer.disconnect();
  }
}
