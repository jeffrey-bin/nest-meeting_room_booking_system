import { PermissionEntity } from './user/entities/permission.entity';

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}
declare global {
  interface JwtUserData {
    userId: number;
    username: string;
    roles: string[];
    permissions: PermissionEntity[];
  }
}
