import { PermissionEntity } from './user/entities/permission.entity';
import { RoleEntity } from './user/entities/role.entity';
import { UserEntity } from './user/entities/user.entity';
import { MeetingRoomEntity } from './meeting-room/entities/meeting-room.entity';
import { BookingEntity } from './booking/entities/booking.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BookingModule } from './booking/booking.module';
import { MeetingRoomModule } from './meeting-room/meeting-room.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoginGuard } from './login.guard';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './permission.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { StatisticModule } from './statistic/statistic.module';
import * as path from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, 'static'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: true,
          logging: true,
          entities: [
            UserEntity,
            RoleEntity,
            PermissionEntity,
            MeetingRoomEntity,
            BookingEntity,
          ],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
        };
      },
      inject: [ConfigService],
    }),
    RedisModule,
    EmailModule,
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: configService.get('jwt_access_token_expires_time'),
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    MeetingRoomModule,
    BookingModule,
    StatisticModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: LoginGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule {}
