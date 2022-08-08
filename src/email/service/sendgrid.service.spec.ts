import { Test, TestingModule } from '@nestjs/testing';
import { HttpClient } from '@/client/HttpClient';
import { HttpModule } from '@nestjs/axios';
import { SendGridService } from '@/email/service/sendgrid.service';
import { sendEmailDtoFixture } from '../../../test/fixtures/send-email.dto.fixture';

describe('SendGridService', () => {
  let httpClient: HttpClient;
  let sendGridService: SendGridService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          timeout: 5000,
        }),
      ],
      providers: [HttpClient, SendGridService],
    }).compile();

    sendGridService = await module.resolve<SendGridService>(SendGridService);
    httpClient = module.get<HttpClient>(HttpClient);
  });

  it('should send email via SendGrid', async () => {
    const httpClientSpy = jest
      .spyOn(httpClient, 'sendRequest')
      .mockReturnValue(Promise.resolve({ success: 'ok' }));

    await sendGridService.send(sendEmailDtoFixture);

    expect(httpClientSpy).toBeCalledTimes(1);
  });
});
