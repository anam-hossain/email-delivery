import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Cache } from 'cache-manager';
import { EMAIL_SERVICE_SENDGRID } from '@/email/service/email-service.constants';
import { SendGridService } from '@/email/service/sendgrid.service';
import { MailjetService } from '@/email/service/mailjet.service';
import { EmailServiceInterface } from '@/email/email.interface';
import { HttpClient } from '@/client/HttpClient';

interface ExpressRequest extends Request {
  emailService?: EmailServiceInterface;
}

@Injectable()
export class EmailServiceMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly httpClient: HttpClient,
  ) {}

  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    let service = EMAIL_SERVICE_SENDGRID;

    try {
      service = await this.cacheManager.get('email-service');
    } catch (error) {}

    req.emailService =
      service === EMAIL_SERVICE_SENDGRID
        ? new SendGridService(this.httpClient)
        : new MailjetService();

    next();
  }
}
