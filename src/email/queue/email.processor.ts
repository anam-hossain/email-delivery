import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SendEmailDto } from '@/email/dto/send-email.dto';
import { EmailService } from '@/email/email.service';

@Processor('email')
export class EmailProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process('send-email')
  async handleTranscode(job: Job) {
    console.log('Consuming data');

    const sendEmailDto: SendEmailDto = job.data;
    await this.emailService.send(sendEmailDto);

    console.log(sendEmailDto);
  }
}
