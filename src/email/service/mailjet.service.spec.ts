import { Test, TestingModule } from '@nestjs/testing';
import { HttpClient } from '@/client/HttpClient';
import { HttpModule } from '@nestjs/axios';
import { sendEmailDtoFixture } from '../../../test/fixtures/send-email.dto.fixture';
import { MailjetService } from '@/email/service/mailjet.service';

describe('MailjetService', () => {
  let httpClient: HttpClient;
  let mailjetService: MailjetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          timeout: 5000,
        }),
      ],
      providers: [HttpClient, MailjetService],
    }).compile();

    mailjetService = await module.resolve<MailjetService>(MailjetService);
    httpClient = module.get<HttpClient>(HttpClient);
  });

  it('should send email via Mailjet', async () => {
    const httpClientSpy = jest
      .spyOn(httpClient, 'sendRequest')
      .mockReturnValue(Promise.resolve({ success: 'ok' }));

    await mailjetService.send(sendEmailDtoFixture);

    expect(httpClientSpy).toBeCalledTimes(1);
  });
});
