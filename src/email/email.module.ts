import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { HttpModule } from '@nestjs/axios';
import { HttpClient } from '@/client/HttpClient';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  providers: [HttpClient],
  controllers: [EmailController],
  exports: [HttpClient],
})
export class EmailModule {}
