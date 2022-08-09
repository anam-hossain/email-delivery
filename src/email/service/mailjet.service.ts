import { Injectable, Scope } from '@nestjs/common';
import { EmailServiceInterface } from '@/email/email.interface';
import { SendEmailDto } from '@/email/dto/send-email.dto';
import { HttpClient } from '@/client/HttpClient';
import { AxiosRequestConfig } from 'axios';

@Injectable({ scope: Scope.TRANSIENT })
export class MailjetService implements EmailServiceInterface {
  constructor(private readonly httClient: HttpClient) {}

  async healthCheck(): Promise<boolean> {
    const request = {
      method: 'GET',
      url: process.env.MAILJET_HEALTHCHECK_ENDPOINT,
    };

    try {
      const response = await this.httClient.sendRequest(request);
      return this.isServiceOperational(response.data);
    } catch (error) {
      return false;
    }
  }

  async send(sendMailDto: SendEmailDto) {
    const request = this.prepareRequest(sendMailDto);

    return await this.httClient.sendRequest(request);
  }

  private prepareRequest(sendMailDto: SendEmailDto): AxiosRequestConfig {
    return {
      data: this.prepareData(sendMailDto),
      method: 'POST',
      url: process.env.MAILJET_API_ENDPOINT,
      headers: this.prepareHeader(),
    };
  }

  private prepareHeader() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Basic ${process.env.MAILJET_API_KEY}`,
    };
  }

  private prepareData(sendMailDto: SendEmailDto) {
    const messages = {
      From: sendMailDto.from,
      To: sendMailDto.to,
      Subject: sendMailDto.subject,
      TextPart: sendMailDto.content,
    };

    if (Array.isArray(sendMailDto.cc) && sendMailDto.cc.length) {
      Object.assign(messages, { Cc: sendMailDto.cc });
    }

    if (Array.isArray(sendMailDto.bcc) && sendMailDto.bcc.length) {
      Object.assign(messages, { Bcc: sendMailDto.bcc });
    }

    return {
      Messages: [messages],
    };
  }

  private isServiceOperational(response): boolean {
    if (!Array.isArray(response.components) && !response.components.length) {
      return false;
    }

    let count = 0;

    for (let i = 0; i < response.components.length; i++) {
      // Send API
      if (
        response.components[i].id === 'tkxw1px3l9jp' &&
        response.components[i].status === 'operational'
      ) {
        count++;
      }

      // REST API
      if (
        response.components[i].id === '0zt14wp9dggy' &&
        response.components[i].status === 'operational'
      ) {
        count++;
      }

      if (count > 1) {
        return true;
      }
    }

    return false;
  }
}
