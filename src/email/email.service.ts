import { Injectable } from '@nestjs/common';
import { SendEmailDto } from '@/email/dto/send-email.dto';
import { EmailServiceFactory } from '@/email/factory/email-service.factory';

@Injectable()
export class EmailService {
  constructor(private readonly emailServiceFactory: EmailServiceFactory) {}

  async send(sendEmailDto: SendEmailDto) {
    const emailServiceApi = await this.emailServiceFactory.create();
    let response;

    try {
      response = await emailServiceApi.send(sendEmailDto);
    } catch (error) {
      response = this.emailServiceFactory
        .getFallBackEmailService()
        .send(sendEmailDto);
    }

    return response;
  }
}
