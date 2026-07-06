import { Response } from "express";
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "./cookieOptions.js";

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken", ACCESS_TOKEN_COOKIE_OPTIONS);
  res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);
};
