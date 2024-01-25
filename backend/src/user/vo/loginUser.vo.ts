import { PermissionEntity } from '../entities/permission.entity';

interface UserInfo {
  id: number;

  username: string;

  nickName: string;

  email: string;

  avatar: string;

  phone: string;

  isFrozen: boolean;

  isAdmin: boolean;

  createTime: Date;

  roles: string[];

  permissions: PermissionEntity[];
}
export class LoginUserVo {
  userInfo: UserInfo;

  accessToken: string;

  refreshToken: string;
}
