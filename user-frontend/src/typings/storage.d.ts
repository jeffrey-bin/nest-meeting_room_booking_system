/** The storage namespace */
declare namespace StorageType {
  interface Session {
    /** The theme color */
    themeColor: string;
  }

  interface Local {
    /** The token */
    token: string;
    /** The refresh token */
    refreshToken: string;
    /** The user info */
    userInfo: Api.Auth.UserInfo;
  }
}
