import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class HttpClient {
  constructor(private readonly httpService: HttpService) {}

  async sendRequest(request: AxiosRequestConfig): Promise<any> {
    try {
      return await lastValueFrom(this.httpService.request(request));
    } catch (error) {
      throw new HttpException(
        error.response?.data,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
