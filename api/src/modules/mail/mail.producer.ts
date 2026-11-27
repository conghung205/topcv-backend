import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class MailProducer {
  constructor(
    @InjectQueue('mail')
    private readonly mailQueue: Queue,
  ) {}

  async addEmail(to: string, subject: string, html: string) {
    await this.mailQueue.add('send-email', {
      to,
      subject,
      html,
    });
  }
}
