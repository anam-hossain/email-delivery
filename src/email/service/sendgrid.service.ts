import { Injectable, Scope } from '@nestjs/common';
import { EmailServiceInterface } from '@/email/email.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class SendGridService implements EmailServiceInterface {
  send() {
    return 'SendGrid Service';
  }
}
