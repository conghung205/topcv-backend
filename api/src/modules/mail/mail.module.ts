import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailProducer } from './mail.producer';
import { MailProcessor } from './mail.processor';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  providers: [MailService, MailProducer, MailProcessor],
  exports: [MailProducer],
})
export class MailModule {}
