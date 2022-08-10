import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class EmailProducer {
  constructor(@InjectQueue('email') private queue: Queue) {}

  async push(data) {
    await this.queue.add('send-email', data);
    console.log('Data pushed to queue');
  }
}
