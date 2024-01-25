import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private readonly reflector: Reflector;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const requiredPermission = this.reflector.getAllAndOverride(
      'requiredPermission',
      [context.getClass(), context.getHandler()],
    );
    if (!requiredPermission) {
      return true;
    }
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('找不到用户信息');
    }
    if (!user.permissions) {
      throw new UnauthorizedException('找不到用户权限信息');
    }
    return user.permissions.some((permission) => {
      return requiredPermission.includes(permission.code);
    });
  }
}
