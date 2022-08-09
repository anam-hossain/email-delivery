import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailService } from '@/email/email.service';
import { SendEmailDto } from '@/email/dto/send-email.dto';
import { SendGridService } from '@/email/service/sendgrid.service';
import { MailjetService } from '@/email/service/mailjet.service';

describe('EmailController', () => {
  let emailService: EmailService;
  let sendGridService: SendGridService;
  let mailjetService: MailjetService;
  let controller: EmailController;
  const mockResponse = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EmailService,
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: SendGridService,
          useValue: {
            healthCheck: jest.fn(),
          },
        },
        {
          provide: MailjetService,
          useValue: {
            healthCheck: jest.fn(),
          },
        },
      ],
      controllers: [EmailController],
    }).compile();

    controller = module.get<EmailController>(EmailController);
    emailService = module.get<EmailService>(EmailService);
    sendGridService = module.get<SendGridService>(SendGridService);
    mailjetService = module.get<MailjetService>(MailjetService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send the email', async () => {
    const emailServiceSpy = jest.spyOn(emailService, 'send');
    await controller.send(new SendEmailDto(), mockResponse);

    expect(emailServiceSpy).toBeCalledTimes(1);
  });

  it('should check the email services health', async () => {
    const sendGridServiceSpy = jest.spyOn(sendGridService, 'healthCheck');
    const mailjetServiceSpy = jest.spyOn(mailjetService, 'healthCheck');
    await controller.healthcheck(mockResponse);

    expect(sendGridServiceSpy).toBeCalledTimes(1);
    expect(mailjetServiceSpy).toBeCalledTimes(1);
  });
});
