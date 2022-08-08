import { HttpClient } from '@/client/HttpClient';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import MockAxios from 'jest-mock-axios';
import { HttpService } from '@nestjs/axios';

const mockAxiosInstance: any = MockAxios.create();
const httpService = new HttpService(mockAxiosInstance);

describe('HttpClient', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should send api request to external service', async () => {
    const response: AxiosResponse = {
      data: {},
      config: {},
      headers: {},
      status: 200,
      statusText: 'OK',
    };

    const httpServiceSpy = jest
      .spyOn(httpService, 'request')
      .mockImplementationOnce(() => of(response));

    const request = {
      method: 'POST',
      url: process.env.SENDGRID_API_ENDPOINT,
      data: { foo: 'bar' },
    };

    const httpClient = new HttpClient(httpService);

    await httpClient.sendRequest(request);

    expect(httpServiceSpy).toBeCalledTimes(1);
  });
});
