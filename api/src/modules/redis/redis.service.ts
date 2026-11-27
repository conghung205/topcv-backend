import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client = new Redis({
    host: 'redis',
    port: 6379,
  });

  async set(key: string, value: string, ttl: number) {
    return this.client.set(key, value, 'EX', ttl);
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async del(key: string) {
    return this.client.del(key);
  }

  async getDel(key: string) {
    return this.client.getdel(key);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async setIfNotExists(key: string, value: string, ttl: number) {
    return this.client.set(key, value, 'EX', ttl, 'NX');
  }
}
