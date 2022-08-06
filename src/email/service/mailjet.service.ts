import { Injectable } from '@nestjs/common';
import { EmailServiceInterface } from '@/email/email.interface';

@Injectable()
export class MailjetService implements EmailServiceInterface {
  send() {
    return 'Mailjet Service';
  }
}
