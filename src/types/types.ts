
export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type JwtPayload = {
    uuid: string,
    email: string,
    isAdmin: boolean
}

export type AuthUser = {
  uuid: string;
  email: string;
  isAdmin: boolean;
}