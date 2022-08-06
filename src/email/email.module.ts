import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { MailjetService } from '@/email/service/mailjet.service';

const providers = [
  {
    provide: '@/email/email.interface',
    useClass: MailjetService,
  },
];

@Module({
  controllers: [EmailController],
  providers: providers,
})
export class EmailModule {}
