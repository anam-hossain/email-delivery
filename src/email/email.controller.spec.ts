import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailService } from '@/email/email.service';
import { SendEmailDto } from '@/email/dto/send-email.dto';
import { SendGridService } from '@/email/service/sendgrid.service';
import { MailjetService } from '@/email/service/mailjet.service';
import { EmailProducer } from '@/email/queue/email.producer';

const payload: any = {
  to: [
    {
      email: 'foo@bar.com',
    },
  ],
  subject: 'Email service',
  from: {
    email: 'foo@bar.com',
  },
  content: 'Email Service test',
  queue: false,
};

describe('EmailController', () => {
  let emailService: EmailService;
  let sendGridService: SendGridService;
  let mailjetService: MailjetService;
  let emailProducer: EmailProducer;
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
        {
          provide: EmailProducer,
          useValue: {
            push: jest.fn(),
          },
        },
      ],
      controllers: [EmailController],
    }).compile();

    controller = module.get<EmailController>(EmailController);
    emailService = module.get<EmailService>(EmailService);
    sendGridService = module.get<SendGridService>(SendGridService);
    mailjetService = module.get<MailjetService>(MailjetService);
    emailProducer = module.get<EmailProducer>(EmailProducer);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should queue the email', async () => {
    const emailProducerSpy = jest.spyOn(emailProducer, 'push');
    await controller.send(new SendEmailDto(), mockResponse);

    expect(emailProducerSpy).toBeCalledTimes(1);
  });

  it('should send the email', async () => {
    const emailServiceSpy = jest.spyOn(emailService, 'send');
    await controller.send(payload, mockResponse);

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
