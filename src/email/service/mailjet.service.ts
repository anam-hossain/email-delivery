import { Injectable, Scope } from '@nestjs/common';
import { EmailServiceInterface } from '@/email/email.interface';
import { SendEmailDto } from '@/email/dto/send-email.dto';

@Injectable({ scope: Scope.TRANSIENT })
export class MailjetService implements EmailServiceInterface {
  async send(sendMailDto: SendEmailDto) {
    return 'Mailjet Service';
  }
}
