import {
  Body,
  CACHE_MANAGER,
  Controller,
  Inject,
  Post,
  Response,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { EmailServiceInterface } from '@/email/email.interface';
import { EmailServiceDecorator } from '@/email/decorator/email-service.decorator';
import { SendEmailDto } from '@/email/dto/send-email.dto';

@Controller('email')
export class EmailController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Post('/send')
  @UsePipes(new ValidationPipe())
  async send(
    @Body() sendEmailDto: SendEmailDto,
    @EmailServiceDecorator() emailService: EmailServiceInterface,
    @Response() res,
  ): Promise<Response> {
    console.log(sendEmailDto.to);
    console.log('Cache information');

    let value = await this.cacheManager.get('email-service');
    console.log(value);

    const services = ['SENDGRID', 'MAILJET'];
    const service = services[Math.floor(Math.random() * services.length)];

    await this.cacheManager.set('email-service', service, { ttl: 0 });

    value = await this.cacheManager.get('email-service');
    console.log('Get the latest value from cache:' + value);
    const response = await emailService.send(sendEmailDto);

    return res.status(200).json({
      msg: 'Email sent successfully',
      providerResponse: response?.data,
    });
  }
}
