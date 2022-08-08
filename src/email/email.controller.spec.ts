import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailService } from '@/email/email.service';
import { SendEmailDto } from '@/email/dto/send-email.dto';

describe('EmailController', () => {
  let emailService: EmailService;
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
      ],
      controllers: [EmailController],
    }).compile();

    controller = module.get<EmailController>(EmailController);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send the email', async () => {
    const emailServiceSpy = jest.spyOn(emailService, 'send');
    await controller.send(new SendEmailDto(), mockResponse);

    expect(emailServiceSpy).toBeCalledTimes(1);
  });
});
