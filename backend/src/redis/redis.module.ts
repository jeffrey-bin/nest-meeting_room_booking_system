import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const maxRetries = 3;
        let retries = 0;
        let client;

        while (retries < maxRetries) {
          try {
            client = new Redis({
              host: configService.get('redis_server_host'),
              port: configService.get('redis_server_port'),
              db: configService.get('redis_server_db'),
            });

            await new Promise((resolve, reject) => {
              client.on('connect', resolve);
              client.on('error', (err) => {
                console.error('Redis connection error:', err);
                reject(err);
              });
            });

            // 如果连接成功，跳出循环
            break;
          } catch (err) {
            retries++;
            console.error(
              `Redis connection failed, retrying (${retries}/${maxRetries})...`,
            );

            // 如果已经尝试了最大次数，发送警报
            if (retries >= maxRetries) {
              console.error(
                'Failed to connect to Redis after maximum retries, sending alert...',
              );
              // 在这里发送你的警报
            }
          }
        }

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
