import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { EmailModule } from 'src/email/email.module';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from './entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity]),
    EmailModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
