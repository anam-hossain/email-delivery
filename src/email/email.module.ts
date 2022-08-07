import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { HttpModule } from '@nestjs/axios';
import { HttpClient } from '@/client/HttpClient';
import { EmailServiceFactory } from '@/email/factory/email-service.factory';
import { EmailService } from '@/email/email.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  providers: [HttpClient, EmailServiceFactory, EmailService],
  controllers: [EmailController],
  exports: [HttpClient],
})
export class EmailModule {}
