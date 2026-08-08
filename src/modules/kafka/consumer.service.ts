import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly kafka: Kafka;
  private readonly consumers: Consumer[] = [];
  constructor(private readonly configService: ConfigService) {
    console.log(
      "this.configService.get<string>('KAFKA_BROKERS')?.split(',')",
      this.configService.get<string>('KAFKA_BROKERS')?.split(','),
    );
    this.kafka = new Kafka({
      brokers: [
        ...(this.configService.get<string>('KAFKA_BROKERS')?.split(',') ?? []),
      ],
    });
  }
  async ensureTopics(topics: string[]) {
    const admin = this.kafka.admin();
    await admin.connect();
    const existing = await admin.listTopics();
    const toCreate = topics.filter((t) => !existing.includes(t));
    if (toCreate.length > 0) {
      await admin.createTopics({
        topics: toCreate.map((topic) => ({
          topic,
          numPartitions: 1,
          replicationFactor: 1,
        })),
        waitForLeaders: true,
      });
    }
    await admin.disconnect();
  }
  //   đọc dữ liệu từ Kafka
  async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({
      groupId: 'be-ams',
      sessionTimeout: 10000, // mặc định 30000ms → giảm xuống 10s
      rebalanceTimeout: 15000, // mặc định 60000ms → giảm xuống 15s
      heartbeatInterval: 3000, // mặc định 3000ms, giữ nguyên
    });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }
  async onApplicationShutdown(signal?: string) {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
