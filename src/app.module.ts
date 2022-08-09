import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { EmailModule } from '@/email/email.module';
import { ConfigModule } from '@nestjs/config';

const inMemoryCacheConfig = {
  isGlobal: true,
};

const redisCacheConfig = {
  store: redisStore,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  isGlobal: true,
};

@Module({
  imports: [
    EmailModule,
    ConfigModule.forRoot(),
    process.env.NODE_ENV === 'test'
      ? CacheModule.register(inMemoryCacheConfig)
      : CacheModule.register<ClientOpts>(redisCacheConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
