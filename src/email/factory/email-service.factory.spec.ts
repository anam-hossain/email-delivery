import { Test, TestingModule } from '@nestjs/testing';
import { EmailServiceFactory } from '@/email/factory/email-service.factory';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common';
import { EMAIL_SERVICE_SENDGRID } from '@/email/service/email-service.constants';
import { HttpClient } from '@/client/HttpClient';
import { HttpModule } from '@nestjs/axios';
import { SendGridService } from '@/email/service/sendgrid.service';
import { MailjetService } from '@/email/service/mailjet.service';

describe('EmailServiceFactory', () => {
  let cacheManager: Cache;
  let emailServiceFactory: EmailServiceFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          timeout: 5000,
        }),
      ],
      providers: [
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn().mockReturnValue(EMAIL_SERVICE_SENDGRID),
          },
        },
        HttpClient,
        EmailServiceFactory,
      ],
    }).compile();

    emailServiceFactory = module.get<EmailServiceFactory>(EmailServiceFactory);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should create the email service api instance', async () => {
    const cacheManagerSpy = jest.spyOn(cacheManager, 'get');
    const emailServiceApi = await emailServiceFactory.create();

    expect(cacheManagerSpy).toBeCalledTimes(1);
    expect(emailServiceApi).toBeInstanceOf(SendGridService);
  });

  it('should create the fallback email api instance', async () => {
    const cacheManagerSpy = jest.spyOn(cacheManager, 'get');
    await emailServiceFactory.create();

    expect(cacheManagerSpy).toBeCalledTimes(1);
    expect(emailServiceFactory.getFallBackEmailService()).toBeInstanceOf(
      MailjetService,
    );
  });
});
