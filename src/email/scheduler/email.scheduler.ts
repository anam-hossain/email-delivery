import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SendGridService } from '@/email/service/sendgrid.service';
import { MailjetService } from '@/email/service/mailjet.service';
import { Cache } from 'cache-manager';
import {
  EMAIL_SERVICE_MAILJET,
  EMAIL_SERVICE_SENDGRID,
} from '@/email/service/email-service.constants';

@Injectable()
export class EmailScheduler {
  private cacheConfig = { ttl: 0 };

  constructor(
    private readonly sendGridService: SendGridService,
    private readonly mailjetService: MailjetService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    console.log('Health check cron started');

    let status = this.sendGridService.healthCheck();

    if (status) {
      await this.cacheManager.set(
        'email-service',
        EMAIL_SERVICE_SENDGRID,
        this.cacheConfig,
      );
      return;
    }

    status = this.mailjetService.healthCheck();

    if (status) {
      await this.cacheManager.set(
        'email-service',
        EMAIL_SERVICE_MAILJET,
        this.cacheConfig,
      );
    }
  }
}
