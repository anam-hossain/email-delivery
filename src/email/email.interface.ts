import { SendEmailDto } from '@/email/dto/send-email.dto';

export interface EmailServiceInterface {
  send(sendMailDto: SendEmailDto): any;
}
