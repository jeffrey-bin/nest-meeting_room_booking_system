export interface UserDetailVo {
  id: number;
  username: string;
  nickName: string;
  email: string;
  avatar: string;
  phone: string;
  isFrozen: boolean;
  isAdmin: boolean;
  createTime: string;
}

export interface UpdatePasswordDto {
  username: string;
  /** @minLength 6 */
  password: string;
  /** @minLength 6 */
  confirmPassword: string;
  email: string;
  captcha: string;
}

export interface LoginUserDto {
  username: string;
  password: string;
}

export interface LoginUserVo {
  userInfo: object;
  accessToken: string;
  refreshToken: string;
}

export interface UpdateUserInfoDto {
  avatar: string;
  nickName: string;
  email: string;
  captcha: string;
}

export interface RegisterUserDto {
  username: string;
  nickName: string;
  /** @minLength 6 */
  password: string;
  email: string;
  captcha: string;
}
