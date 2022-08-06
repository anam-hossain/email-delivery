import { Injectable, Scope } from '@nestjs/common';
import { EmailServiceInterface } from '@/email/email.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class MailjetService implements EmailServiceInterface {
  send() {
    return 'Mailjet Service';
  }
}
