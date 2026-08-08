import { Module } from '@nestjs/common';
import { KafkaModule } from '../kafka/kafka.module';
import { MailConsumer } from './mail.consumer';
import { MailService } from './mail.service';

@Module({
    imports:[KafkaModule],
    providers:[MailConsumer,MailService]
})
export class MailModule {}
