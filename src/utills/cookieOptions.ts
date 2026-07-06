import { CookieOptions } from "express";
import { ACCESS_TOKEN_COOKIE_MAX_AGE, REFRESH_TOKEN_COOKIE_MAX_AGE } from "./consts.js";

export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
};

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
};
