import { Injectable, Scope } from '@nestjs/common';
import { EmailServiceInterface } from '@/email/email.interface';
import { SendEmailDto } from '@/email/dto/send-email.dto';
import { HttpClient } from '@/client/HttpClient';
import { AxiosRequestConfig } from 'axios';

@Injectable({ scope: Scope.TRANSIENT })
export class MailjetService implements EmailServiceInterface {
  constructor(private readonly httClient: HttpClient) {}

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
}
