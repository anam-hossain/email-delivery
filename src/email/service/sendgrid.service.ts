import { Injectable, Scope } from '@nestjs/common';
import { EmailServiceInterface } from '@/email/email.interface';
import { SendEmailDto } from '@/email/dto/send-email.dto';
import { AxiosRequestConfig } from 'axios';
import { HttpClient } from '@/client/HttpClient';

@Injectable({ scope: Scope.TRANSIENT })
export class SendGridService implements EmailServiceInterface {
  constructor(private readonly httClient: HttpClient) {}

  async send(sendMailDto: SendEmailDto) {
    const request = this.prepareRequest(sendMailDto);

    console.log(JSON.stringify(request));
    const result = await this.httClient.sendRequest(request);
    console.log(result);

    return 'SendGrid Service';
  }

  prepareRequest(sendMailDto: SendEmailDto): AxiosRequestConfig {
    return {
      data: this.prepareData(sendMailDto),
      method: 'POST',
      url: process.env.SENDGRID_API_ENDPOINT,
      headers: this.prepareHeader(),
    };
  }

  private prepareHeader() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
    };
  }

  private prepareData(sendMailDto: SendEmailDto) {
    return {
      personalizations: this.preparePersonalizations(sendMailDto),
      content: [
        {
          type: 'text/plain',
          value: sendMailDto.content,
        },
      ],
      from: sendMailDto.from,
      reply_to: sendMailDto.from,
    };
  }

  private preparePersonalizations(sendMailDto: SendEmailDto) {
    const personalizations = {
      to: sendMailDto.to,
      subject: sendMailDto.subject,
    };

    if (Array.isArray(sendMailDto.cc) && sendMailDto.cc.length) {
      Object.assign(personalizations, { cc: sendMailDto.cc });
    }

    if (Array.isArray(sendMailDto.bcc) && sendMailDto.bcc.length) {
      Object.assign(personalizations, { bcc: sendMailDto.bcc });
    }

    return [personalizations];
  }
}
