import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

export const RequiredLogin = () => SetMetadata('requiredLogin', true);

export const RequiredPermission = (...args: string[]) =>
  SetMetadata('requiredPermission', args);

export const UserInfo = createParamDecorator(
  (data: keyof JwtUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return data ? request.user[data] : request.user;
  },
);
