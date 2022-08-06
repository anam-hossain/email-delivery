import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { EmailModule } from '@/email/email.module';
import { ConfigModule } from '@nestjs/config';
import { EmailServiceMiddleware } from '@/email/middleware/email.middleware';

@Module({
  imports: [
    EmailModule,
    ConfigModule.forRoot(),
    CacheModule.register<ClientOpts>({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EmailServiceMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
