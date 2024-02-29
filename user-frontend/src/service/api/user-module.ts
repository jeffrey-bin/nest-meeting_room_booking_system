import {
  LoginUserDto,
  LoginUserVo,
  RegisterUserDto,
  UpdatePasswordDto,
  UpdateUserInfoDto,
  UserDetailVo,
} from "./data-contracts";
import { request } from "./http-client";

export class User {
  /**
   * No description
   *
   * @tags 用户管理模块
   * @name UserControllerUserInfo
   * @request GET:/user/info
   */
  userControllerUserInfo = (params: Record<string, any> = {}) =>
    request<UserDetailVo, any>({
      url: "/user/info",
      method: "GET",
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags 用户管理模块
   * @name UserControllerUpdatePassword
   * @request POST:/user/updatePassword
   */
  userControllerUpdatePassword = (data: UpdatePasswordDto, params: Record<string, any> = {}) =>
    request<object, any>({
      url: "/user/updatePassword",
      method: "POST",
      data,
      headers: { "Content-Type": "application/json" },
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags 用户管理模块
   * @name UserControllerUpdatePassword2
   * @request POST:/user/admin/updatePassword
   * @originalName userControllerUpdatePassword
   * @duplicate
   */
  userControllerUpdatePassword2 = (data: UpdatePasswordDto, params: Record<string, any> = {}) =>
    request<object, any>({
      url: "/user/admin/updatePassword",
      method: "POST",
      data,
      headers: { "Content-Type": "application/json" },
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags 用户管理模块
   * @name UserControllerUserLogin
   * @request POST:/user/login
   */
  userControllerUserLogin = (data: LoginUserDto, params: Record<string, any> = {}) =>
    request<LoginUserVo, any>({
      url: "/user/login",
      method: "POST",
      data,
      headers: { "Content-Type": "application/json" },
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags 用户管理模块
   * @name UserControllerAdminLogin
   * @request POST:/user/admin/login
   */
  userControllerAdminLogin = (data: LoginUserDto, params: Record<string, any> = {}) =>
    request<LoginUserVo, any>({
      url: "/user/admin/login",
      method: "POST",
      data,
      headers: { "Content-Type": "application/json" },
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags 用户管理模块
   * @name UserControllerRefreshToken
   * @request GET:/user/refreshToken
   */
  userControllerRefreshToken = (
    query: {
      refreshToken: string;
    },
    params: Record<string, any> = {},
  ) =>
    request<void, any>({
      url: "/user/refreshToken",
      method: "GET",
      params: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags 用户管理模块
   * @name UserControllerAdminRefreshToken
   * @request GET:/user/admin/refreshToken
   */
  userControllerAdminRefreshToken = (
    query: {
      refreshToken: string;
    },
    params: Record<string, any> = {},
  ) =>
    request<void, any>({
      url: "/user/admin/refreshToken",
      method: "GET",
      params: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags 用户管理模块
   * @name UserControllerInitData
   * @request GET:/user/initData
   */
  userControllerInitData = (params: Record<string, any> = {}) =>
    request<void, any>({
      url: "/user/initData",
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags 用户管理模块
   * @name UserControllerSendCaptcha
   * @request GET:/user/getCaptcha
   */
  userControllerSendCaptcha = (
    query: {
      address: string;
    },
    params: Record<string, any> = {},
  ) =>
    request<string, any>({
      url: "/user/getCaptcha",
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags 用户管理模块
   * @name UserControllerSendUpdatePasswordCaptcha
   * @request GET:/user/getUpdatePasswordCaptcha
   */
  userControllerSendUpdatePasswordCaptcha = (
    query: {
      address: string;
    },
    params: Record<string, any> = {},
  ) =>
    request<string, any>({
      url: "/user/getUpdatePasswordCaptcha",
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags 用户管理模块
   * @name UserControllerSendUpdateUserInfoCaptcha
   * @request GET:/user/getUpdateUserInfoCaptcha
   */
  userControllerSendUpdateUserInfoCaptcha = (
    query: {
      address: string;
    },
    params: Record<string, any> = {},
  ) =>
    request<string, any>({
      url: "/user/getUpdateUserInfoCaptcha",
      method: "GET",
      params: query,
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags 用户管理模块
   * @name UserControllerUpdateUserInfo
   * @request POST:/user/updateUserInfo
   */
  userControllerUpdateUserInfo = (data: UpdateUserInfoDto, params: Record<string, any> = {}) =>
    request<object, any>({
      url: "/user/updateUserInfo",
      method: "POST",
      data,
      headers: { "Content-Type": "application/json" },
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags 用户管理模块
   * @name UserControllerUpdateUserInfo2
   * @request POST:/user/admin/updateUserInfo
   * @originalName userControllerUpdateUserInfo
   * @duplicate
   */
  userControllerUpdateUserInfo2 = (data: UpdateUserInfoDto, params: Record<string, any> = {}) =>
    request<object, any>({
      url: "/user/admin/updateUserInfo",
      method: "POST",
      data,
      headers: { "Content-Type": "application/json" },
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags 用户管理模块
   * @name UserControllerRegister
   * @request POST:/user/register
   */
  userControllerRegister = (data: RegisterUserDto, params: Record<string, any> = {}) =>
    request<object, any>({
      url: "/user/register",
      method: "POST",
      data,
      headers: { "Content-Type": "application/json" },
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags 用户管理模块
   * @name UserControllerAdminRegister
   * @request POST:/user/admin/register
   */
  userControllerAdminRegister = (data: RegisterUserDto, params: Record<string, any> = {}) =>
    request<object, any>({
      url: "/user/admin/register",
      method: "POST",
      data,
      headers: { "Content-Type": "application/json" },
      responseType: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags 用户管理模块
   * @name UserControllerList
   * @request GET:/user/list
   */
  userControllerList = (
    query: {
      page: number;
      pageSize: number;
      username: string;
      nickName: string;
    },
    params: Record<string, any> = {},
  ) =>
    request<void, any>({
      url: "/user/list",
      method: "GET",
      params: query,
      ...params,
    });
}
export const userApi = new User();
