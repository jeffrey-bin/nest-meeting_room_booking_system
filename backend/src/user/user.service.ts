import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { md5 } from 'src/utils';
import { EmailService } from 'src/email/email.service';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from './entities/permission.entity';
import { LoginUserDto } from './dto/loginUser.dto';
import { LoginUserVo } from './vo/loginUser.vo';
import { UserDetailVo } from './vo/userInfo.vo';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';
const REDIS_REGISTER_CAPTCHA_PREFIX = 'captcha_';
const REDIS_UPDATE_PASSWORD_CAPTCHA_PREFIX = 'update_password_captcha_';
const REDIS_UPDATE_USER_INFO_CAPTCHA_PREFIX = 'update_user_info_captcha_';
const REDIS_CAPTCHA_EXPIRES_TIME = 1 * 60;

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>;

  @InjectRepository(RoleEntity)
  private readonly roleRepository: Repository<RoleEntity>;

  @InjectRepository(PermissionEntity)
  private readonly permissionRepository: Repository<PermissionEntity>;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(EmailService)
  private readonly emailService: EmailService;

  async initData() {
    const user3 = new UserEntity();
    user3.username = 'wangwu';
    user3.password = md5('333333');
    user3.email = 'zz@yy.com';
    user3.nickName = '王五';
    user3.isAdmin = true;

    const role1 = new RoleEntity();
    role1.name = '管理员';

    const role2 = new RoleEntity();
    role2.name = '普通用户';

    const permission1 = new PermissionEntity();
    permission1.code = 'ccc';
    permission1.description = '访问 ccc 接口';

    const permission2 = new PermissionEntity();
    permission2.code = 'ddd';
    permission2.description = '访问 ddd 接口';
    user3.roles = [role1, role2];

    role1.permissions = [permission1, permission2];
    role2.permissions = [permission1];

    // await this.permissionRepository.save([permission1, permission2]);
    // await this.roleRepository.save([role1, role2]);
    // await this.userRepository.save([user3]);
  }

  async findJwtUserData(
    params: FindOneOptions<UserEntity>,
  ): Promise<JwtUserData> {
    const user = await this.userRepository.findOne(params);
    return {
      userId: user.id,
      username: user.username,
      roles: this.tranformRoles(user.roles),
      permissions: this.transformPermission(user.roles),
    };
  }
  private tranformRoles(roles: RoleEntity[]) {
    return roles.map((role) => role.id);
  }
  private transformPermission(roles: RoleEntity[]) {
    return roles.reduce(
      (pre, cur) => [
        ...pre,
        ...cur.permissions.filter(
          (item) =>
            // deduplicate permissions by code
            pre.findIndex((preItem) => item.code === preItem.code) === -1,
        ),
      ],
      [],
    );
  }
  async findDetailByUserId(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    const vo = new UserDetailVo();
    const {
      id,
      username,
      nickName,
      email,
      avatar,
      phone,
      isFrozen,
      isAdmin,
      createTime,
    } = user;
    vo.id = id;
    vo.username = username;
    vo.nickName = nickName;
    vo.email = email;
    vo.avatar = avatar;
    vo.phone = phone;
    vo.isFrozen = isFrozen;
    vo.isAdmin = isAdmin;
    vo.createTime = createTime;
    return vo;
  }
  async login(loginUserDto: LoginUserDto, isAdmin = false) {
    const { username, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: {
        username,
        isAdmin: isAdmin ? true : undefined,
      },
      relations: ['roles', 'roles.permissions'],
    });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (user.password !== md5(password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }
    const { roles } = user;
    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nickName,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      createTime: user.createTime,
      roles: this.tranformRoles(roles),
      permissions: this.transformPermission(roles),
    };
    return vo;
  }
  async sendCaptcha(email: string, prefix: string, subject: string) {
    // 生成随机验证码
    const captcha = Math.random().toString().slice(-6);
    // 将验证码存入redis，有效期为1分钟
    await this.redisService.set(
      `${prefix}${email}`,
      `${captcha}`,
      REDIS_CAPTCHA_EXPIRES_TIME,
    );
    try {
      // 发送验证码到邮箱
      await this.emailService.send(
        email,
        subject,
        `您的验证码为：${captcha}，有效期为1分钟`,
      );
      this.logger.log(`captcha ${captcha} sent to ${email}`);
      return '验证码发送成功';
    } catch (error) {
      throw new HttpException(
        `验证码发送失败:${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async sendRegisterCaptcha(email: string) {
    return await this.sendCaptcha(
      email,
      REDIS_REGISTER_CAPTCHA_PREFIX,
      '注册账户',
    );
  }

  async sendUpdatePasswordCaptcha(email: string) {
    return await this.sendCaptcha(
      email,
      REDIS_UPDATE_PASSWORD_CAPTCHA_PREFIX,
      '修改密码',
    );
  }
  async sendUpdateUserInfoCaptcha(email: string) {
    return await this.sendCaptcha(
      email,
      REDIS_UPDATE_USER_INFO_CAPTCHA_PREFIX,
      '修改用户信息',
    );
  }

  private async checkCaptcha(
    user: UserEntity,
    email: string,
    captcha: string,
    prefix: string,
  ) {
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    // 检查邮箱是否正确
    if (user.email !== email) {
      throw new HttpException('邮箱错误', HttpStatus.BAD_REQUEST);
    }
    // 按照email查询redis中的验证码
    const captchaInRedis = await this.redisService.get(`${prefix}${email}`);
    if (!captchaInRedis) {
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    }
    if (captchaInRedis !== captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }
    // 验证码正确，删除redis中的验证码
    await this.redisService.del(`${prefix}${email}`);
  }

  async updateUserInfo(userId: number, updateUserInfoDto: UpdateUserInfoDto) {
    const { email, captcha, avatar, nickName } = updateUserInfoDto;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    await this.checkCaptcha(
      user,
      email,
      captcha,
      REDIS_UPDATE_USER_INFO_CAPTCHA_PREFIX,
    );
    user.avatar = avatar;
    user.nickName = nickName;
    try {
      await this.userRepository.update({ id: user.id }, user);
      return '用户信息修改成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '用户信息修改失败';
    }
  }
  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const { username, password, confirmPassword, email, captcha } =
      updatePasswordDto;
    // 按照username查询数据库中是否已经存在该用户
    const user = await this.userRepository.findOneBy({
      username,
    });
    await this.checkCaptcha(
      user,
      email,
      captcha,
      REDIS_UPDATE_PASSWORD_CAPTCHA_PREFIX,
    );
    // 检查密码是否一致
    if (password !== confirmPassword) {
      throw new HttpException('两次密码不一致', HttpStatus.BAD_REQUEST);
    }
    // 更新密码
    user.password = md5(password);
    try {
      await this.userRepository.update({ id: user.id }, user);
      return '密码修改成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '密码修改失败';
    }
  }
  async register(registerDto: RegisterUserDto, isAdmin = false) {
    // 按照email查询redis中的验证码
    const captcha = await this.redisService.get(
      `${REDIS_REGISTER_CAPTCHA_PREFIX}${registerDto.email}`,
    );
    if (!captcha) {
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    }
    if (captcha !== registerDto.captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }
    // 验证码正确，删除redis中的验证码
    await this.redisService.del(
      `${REDIS_REGISTER_CAPTCHA_PREFIX}${registerDto.email}`,
    );

    // 按照username查询数据库中是否已经存在该用户
    const isUsernameExist = await this.userRepository.findOneBy({
      username: registerDto.username,
    });
    if (isUsernameExist) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    const { email, username, nickName, password } = registerDto;

    const newUser = new UserEntity();
    newUser.email = email;
    newUser.username = username;
    newUser.nickName = nickName;
    newUser.password = md5(password);
    newUser.isAdmin = isAdmin;

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }
}
