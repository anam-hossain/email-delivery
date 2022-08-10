import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AppModule } from '@/app.module';
import { sendEmailDtoFixture } from '@test/fixtures/send-email.dto.fixture';
import { Cache } from 'cache-manager';
import { EMAIL_SERVICE_SENDGRID } from '@/email/service/email-service.constants';
import { BullModule, getQueueToken } from '@nestjs/bull';

const mockHttpService = {
  request: jest.fn(),
};

const queueMock = {
  add: jest.fn(),
  process: jest.fn(),
};

describe('EmailController (e2e)', () => {
  let app: INestApplication;
  let cacheManager;
  let server;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        BullModule.registerQueue({
          name: 'email',
        }),
      ],
    })
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .overrideProvider(getQueueToken('email'))
      .useValue(queueMock)
      .compile();

    cacheManager = moduleFixture.get<Cache>(CACHE_MANAGER);
    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  it('/email/send (POST) - should send email and return 200 response', async () => {
    await cacheManager.set('email-service', EMAIL_SERVICE_SENDGRID);

    mockHttpService.request.mockImplementation(() => {
      return of({
        status: HttpStatus.OK,
        data: 'email sent',
      });
    });

    return request(server)
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

    return request(server)
      .post('/email/send')
      .send(sendEmailDtoFixture)
      .expect(200);
  });

  it('/email/send (POST) - 400 response - validation errors', async () => {
    const payload = {
      subject: 'Hello',
      content: 'Email service',
      from: {
        email: 'bar@baz.com',
      },
    };

    return request(server)
      .post('/email/send')
      .send(payload)
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['to should not be empty'],
        error: 'Bad Request',
      });
  });

  it('/email/send (POST) - should queue email and return 202 response', async () => {
    const payload = sendEmailDtoFixture;
    delete payload.queue;

    return request(server).post('/email/send').send(payload).expect(202);
  });

  afterEach(async () => {
    await app.close();
    server.close();
  });
});
