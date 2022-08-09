import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AppModule } from '@/app.module';
import { sendEmailDtoFixture } from '@test/fixtures/send-email.dto.fixture';
import { Cache } from 'cache-manager';
import { EMAIL_SERVICE_SENDGRID } from '@/email/service/email-service.constants';

const mockHttpService = {
  request: jest.fn(),
};

describe('EmailController (e2e)', () => {
  let app: INestApplication;
  let cacheManager;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    cacheManager = moduleFixture.get<Cache>(CACHE_MANAGER);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/email/send (POST) - should send email and return 200 response', async () => {
    await cacheManager.set('email-service', EMAIL_SERVICE_SENDGRID);

    mockHttpService.request.mockImplementation(() => {
      return of({
        status: HttpStatus.OK,
        data: 'email sent',
      });
    });

    return request(app.getHttpServer())
      .post('/email/send')
      .send(sendEmailDtoFixture)
      .expect(200);
  });

  it('/email/send (POST) - should send email via alternate service', async () => {
    // set default service
    await cacheManager.set('email-service', EMAIL_SERVICE_SENDGRID);

    mockHttpService.request
      .mockImplementationOnce(() => {
        throw new Error('Server down');
      })
      .mockImplementationOnce((data) => {
        expect(data.url).toEqual(process.env.MAILJET_API_ENDPOINT);

        return of({
          status: HttpStatus.OK,
          data: 'email sent',
        });
      });

    return request(app.getHttpServer())
      .post('/email/send')
      .send(sendEmailDtoFixture)
      .expect(200);
  });

  it('/email/send (POST) - 400 response - validation errors', () => {
    const payload = {
      subject: 'Hello',
      content: 'Email service',
      from: {
        email: 'bar@baz.com',
      },
    };

    return request(app.getHttpServer())
      .post('/email/send')
      .send(payload)
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['to should not be empty'],
        error: 'Bad Request',
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
