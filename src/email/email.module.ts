import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { HttpModule } from '@nestjs/axios';
import { HttpClient } from '@/client/HttpClient';
import { EmailServiceFactory } from '@/email/factory/email-service.factory';
import { EmailService } from '@/email/email.service';
import { SendGridService } from '@/email/service/sendgrid.service';
import { MailjetService } from '@/email/service/mailjet.service';
import { EmailScheduler } from '@/email/scheduler/email.scheduler';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  providers: [
    HttpClient,
    EmailServiceFactory,
    EmailService,
    SendGridService,
    MailjetService,
    EmailScheduler,
  ],
  controllers: [EmailController],
  exports: [HttpClient],
})
export class EmailModule {}
