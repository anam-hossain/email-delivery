import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { HttpClient } from '@/client/HttpClient';
import { EMAIL_SERVICE_SENDGRID } from '@/email/service/email-service.constants';
import { EmailServiceInterface } from '@/email/email.interface';
import { SendGridService } from '@/email/service/sendgrid.service';
import { MailjetService } from '@/email/service/mailjet.service';

@Injectable()
export class EmailServiceFactory {
  private fallBackEmailServiceApi: EmailServiceInterface;
  private emailServiceApi: EmailServiceInterface;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly httpClient: HttpClient,
  ) {}

  async create(): Promise<EmailServiceInterface> {
    let service = EMAIL_SERVICE_SENDGRID;

    try {
      service = await this.cacheManager.get('email-service');
    } catch (error) {}

    if (service === EMAIL_SERVICE_SENDGRID) {
      this.emailServiceApi = new SendGridService(this.httpClient);
      this.fallBackEmailServiceApi = new MailjetService(this.httpClient);
    } else {
      this.emailServiceApi = new MailjetService(this.httpClient);
      this.fallBackEmailServiceApi = new SendGridService(this.httpClient);
    }

    return this.emailServiceApi;
  }

  getFallBackEmailService(): EmailServiceInterface {
    return this.fallBackEmailServiceApi;
  }
}
