import { Controller, Inject, Post, Response } from '@nestjs/common';
import { EmailServiceInterface } from '@/email/email.interface';

@Controller('email')
export class EmailController {
  constructor(
    @Inject('@/email/email.interface')
    private readonly emailService: EmailServiceInterface,
  ) {}
  @Post('/send')
  async send(@Response() res): Promise<Response> {
    const msg = this.emailService.send();
    return res.status(200).json(msg);
  }
}
