import { CookieOptions } from "express";
import { ACCESS_TOKEN_COOKIE_MAX_AGE, REFRESH_TOKEN_COOKIE_MAX_AGE } from "./consts.js";

export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
};

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
};

// remember=false drops maxAge: the cookies become session cookies and the
// browser clears them on close.
export const buildAccessCookieOptions = (remember: boolean): CookieOptions => ({
  ...ACCESS_TOKEN_COOKIE_OPTIONS,
  maxAge: remember ? ACCESS_TOKEN_COOKIE_MAX_AGE : undefined,
});

export const buildRefreshCookieOptions = (remember: boolean): CookieOptions => ({
  ...REFRESH_TOKEN_COOKIE_OPTIONS,
  maxAge: remember ? REFRESH_TOKEN_COOKIE_MAX_AGE : undefined,
});
