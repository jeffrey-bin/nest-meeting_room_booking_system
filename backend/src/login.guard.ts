import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor() {}

  @Inject()
  private readonly reflector: Reflector;

  @Inject()
  private readonly jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredLogin = this.reflector.getAllAndOverride('requiredLogin', [
      context.getClass(),
      context.getHandler(),
    ]);
    // 如果没有使用 @RequiredLogin() 装饰器，则不需要登录
    if (!requiredLogin) {
      return true;
    }
    const authorization = request.headers.authorization;
    // 如果没有携带 token，则抛出异常
    if (!authorization) {
      throw new UnauthorizedException('请登录后再操作');
    }
    // 如果携带的token合法，则将用户信息挂载到 request.user 上
    // token 不合法，则抛出异常
    try {
      const data = this.jwtService.verify<JwtUserData>(
        authorization.split(' ')[1],
      );
      const { userId, username, roles, permissions } = data;
      request.user = { userId, username, roles, permissions };
      return true;
    } catch (e) {
      throw new UnauthorizedException('登录态异常');
    }
  }
}
