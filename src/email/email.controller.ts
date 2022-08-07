import {
  Body,
  Controller,
  Post,
  Response,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SendEmailDto } from '@/email/dto/send-email.dto';
import { EmailService } from '@/email/email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/send')
  @UsePipes(new ValidationPipe())
  async send(
    @Body() sendEmailDto: SendEmailDto,
    @Response() res,
  ): Promise<Response> {
    const response = await this.emailService.send(sendEmailDto);

    return res.status(200).json({
      msg: 'Email sent successfully',
      providerResponse: response?.data,
    });
  }
}
