import { Controller, Post, Body, Get, Query, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  RequiredLogin,
  RequiredPermission,
  UserInfo,
} from '../custom.decorator';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;
  @Get('ddd')
  @RequiredLogin()
  @RequiredPermission('ddd')
  async ddd() {
    return 'ddd';
  }

  @Get('ccc')
  @RequiredLogin()
  @RequiredPermission('ccc')
  async ccc(@UserInfo('userId') userId: number, @UserInfo() userInfo) {
    console.log(userId);
    console.log(userInfo);

    return 'ccc';
  }
  jwtSign(user: JwtUserData) {
    const { userId, username, roles, permissions } = user;
    const accessToken = this.jwtService.sign({
      userId,
      username,
      roles,
      permissions,
    });
    const refreshToken = this.jwtService.sign(
      {
        userId,
      },
      {
        expiresIn: this.configService.get('jwt_refresh_token_expires_time'),
      },
    );
    return { accessToken, refreshToken };
  }

  @Get('info')
  @RequiredLogin()
  async userInfo(@UserInfo('userId') userId: number) {
    return await this.userService.findDetailByUserId(userId);
  }

  @Post(['updatePassword', 'admin/updatePassword'])
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return await this.userService.updatePassword(updatePasswordDto);
  }

  @Post('login')
  async userLogin(@Body() loginUserDto: LoginUserDto, isAdmin: boolean) {
    try {
      const user = await this.userService.login(loginUserDto, isAdmin);
      const { id, username, roles, permissions } = user.userInfo;
      const { accessToken, refreshToken } = this.jwtSign({
        userId: id,
        username,
        roles,
        permissions,
      });

      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      return user;
    } catch (e) {
      throw e;
    }
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    return await this.userLogin(loginUser, true);
  }

  @Get('refreshToken')
  async refreshToken(
    @Query('refreshToken') refreshToken: string,
    isAdmin: boolean = false,
  ) {
    try {
      const data = this.jwtService.verify<JwtUserData>(refreshToken);
      if (!data) {
        throw new Error('refreshToken 非法');
      }
      const { userId } = data;
      const user = await this.userService.findJwtUserData({
        where: { id: userId, isAdmin },
        relations: ['roles', 'roles.permissions'],
      });
      const { username, roles, permissions } = user;

      const { accessToken, refreshToken: newRefreshToken } = this.jwtSign({
        userId,
        username,
        roles,
        permissions,
      });
      return { accessToken, refreshToken: newRefreshToken };
    } catch (e) {
      throw new Error('refreshToken 已失效，请重新登录');
    }
  }

  @Get('admin/refreshToken')
  async adminRefreshToken(@Query('refreshToken') refreshToken: string) {
    return await this.refreshToken(refreshToken, true);
  }

  @Get('initData')
  async initData() {
    return await this.userService.initData();
  }
  @Get('getCaptcha')
  async sendCaptcha(@Query('address') address: string) {
    return await this.userService.sendRegisterCaptcha(address);
  }
  @Get('getUpdatePasswordCaptcha')
  async sendUpdatePasswordCaptcha(@Query('address') address: string) {
    return await this.userService.sendUpdatePasswordCaptcha(address);
  }
  @Get('getUpdateUserInfoCaptcha')
  async sendUpdateUserInfoCaptcha(@Query('address') address: string) {
    return await this.userService.sendUpdateUserInfoCaptcha(address);
  }

  @Post(['updateUserInfo', 'admin/updateUserInfo'])
  @RequiredLogin()
  async updateUserInfo(
    @UserInfo('userId') userId: number,
    @Body() updateUserInfoDto: UpdateUserInfoDto,
  ) {
    return await this.userService.updateUserInfo(userId, updateUserInfoDto);
  }
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }
  @Post('admin/register')
  async adminRegister(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser, true);
  }
}
