import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { HttpModule } from '@nestjs/axios';
import { HttpClient } from '@/client/HttpClient';
import { EmailServiceFactory } from '@/email/factory/email-service.factory';
import { EmailService } from '@/email/email.service';
import { SendGridService } from '@/email/service/sendgrid.service';
import { MailjetService } from '@/email/service/mailjet.service';
import { EmailScheduler } from '@/email/scheduler/email.scheduler';
import { BullModule } from '@nestjs/bull';
import { EmailProducer } from '@/email/queue/email.producer';
import { EmailProcessor } from '@/email/queue/email.processor';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [
    HttpClient,
    EmailServiceFactory,
    EmailService,
    SendGridService,
    MailjetService,
    EmailScheduler,
    EmailProducer,
    EmailProcessor,
  ],
  controllers: [EmailController],
  exports: [HttpClient],
})
export class EmailModule {}
