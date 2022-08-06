import { Injectable } from '@nestjs/common';
import { EmailServiceInterface } from '@/email/email.interface';

@Injectable()
export class SendGridService implements EmailServiceInterface {
  send() {
    return 'SendGrid Service';
  }
}
