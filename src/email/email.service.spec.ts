import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '@/email/email.service';
import { EmailServiceFactory } from '@/email/factory/email-service.factory';
import { SendEmailDto } from '@/email/dto/send-email.dto';

describe('EmailService', () => {
  let emailService: EmailService;
  let emailServiceFactory: EmailServiceFactory;

  const mockSendgridService = {
    send: jest.fn().mockReturnValue({ service: 'SendGrid' }),
  };

  const mockMailjetService = {
    send: jest.fn().mockReturnValue({ service: 'Mailjet' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: EmailServiceFactory,
          useValue: {
            create: jest.fn().mockReturnValue(mockSendgridService),
            getFallBackEmailService: jest
              .fn()
              .mockReturnValue(mockMailjetService),
          },
        },
      ],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
    emailServiceFactory = module.get<EmailServiceFactory>(EmailServiceFactory);
  });

  it('should send the email', async () => {
    const emailServiceFactorySpy = jest.spyOn(emailServiceFactory, 'create');
    const result = await emailService.send(new SendEmailDto());

    expect(emailServiceFactorySpy).toBeCalledTimes(1);
    expect('SendGrid').toEqual(result.service);
  });

  it('should send email by alternate service if something went wrong', async () => {
    const mockSendgridService: any = {
      send: jest.fn().mockImplementation(() => {
        throw new Error('Server down');
      }),
    };

    const emailServiceFactorySpy = jest
      .spyOn(emailServiceFactory, 'create')
      .mockReturnValue(mockSendgridService);

    const result = await emailService.send(new SendEmailDto());

    expect(emailServiceFactorySpy).toBeCalledTimes(1);
    expect('Mailjet').toEqual(result.service);
  });
});
