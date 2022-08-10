import {
  Body,
  Controller,
  Get,
  Post,
  Response,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SendEmailDto } from '@/email/dto/send-email.dto';
import { EmailService } from '@/email/email.service';
import { SendGridService } from '@/email/service/sendgrid.service';
import { MailjetService } from '@/email/service/mailjet.service';
import { EmailProducer } from '@/email/queue/email.producer';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly sendGridService: SendGridService,
    private readonly mailjetService: MailjetService,
    private readonly emailProducer: EmailProducer,
  ) {}

  @Post('/send')
  @UsePipes(new ValidationPipe())
  async send(
    @Body() sendEmailDto: SendEmailDto,
    @Response() res,
  ): Promise<Response> {
    if (sendEmailDto.queue !== undefined && !sendEmailDto.queue) {
      const response = await this.emailService.send(sendEmailDto);

      return res.status(200).json({
        msg: 'Email sent successfully',
        providerResponse: response?.data,
      });
    }

    // By default, email will be queued
    await this.emailProducer.push(sendEmailDto);

    return res.status(202).json({
      msg: 'Email queued successfully',
    });
  }

  @Get('/healthcheck')
  async healthcheck(@Response() res): Promise<Response> {
    const sendGridStatus = await this.sendGridService.healthCheck();
    const mailjetStatus = await this.mailjetService.healthCheck();

    return res.status(200).json({
      sendGrid: sendGridStatus,
      mailjet: mailjetStatus,
    });
  }
}
