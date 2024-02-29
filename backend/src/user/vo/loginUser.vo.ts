import { UserDetailVo } from './userInfo.vo';

export class LoginUserVo {
  userInfo: UserDetailVo;

  accessToken: string;

  refreshToken: string;
}
