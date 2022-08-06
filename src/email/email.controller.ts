import {
  CACHE_MANAGER,
  Controller,
  Inject,
  Post,
  Response,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { EmailServiceInterface } from '@/email/email.interface';
import { EmailServiceDecorator } from '@/email/decorator/email-service.decorator';

@Controller('email')
export class EmailController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Post('/send')
  async send(
    @EmailServiceDecorator() emailService: EmailServiceInterface,
    @Response() res,
  ): Promise<Response> {
    console.log(process.env.REDIS_HOST, process.env.REDIS_PORT);
    console.log('Cache information');

    let value = await this.cacheManager.get('email-service');
    console.log(value);

    const services = ['SENDGRID', 'MAILJET'];
    const service = services[Math.floor(Math.random() * services.length)];

    await this.cacheManager.set('email-service', service, { ttl: 0 });

    value = await this.cacheManager.get('email-service');
    console.log('Get the latest value from cache:' + value);
    const msg = emailService.send();
    return res.status(200).json(msg);
  }
}
