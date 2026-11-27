import { Processor, WorkerHost } from '@nestjs/bullmq';
import { MailService } from './mail.service';
import { Job } from 'bullmq';

@Processor('mail')
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    const { to, subject, html } = job.data;

    await this.mailService.sendMail(to, subject, html);
  }
}
