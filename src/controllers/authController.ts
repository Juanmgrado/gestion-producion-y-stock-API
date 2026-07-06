import { NextFunction, Request, Response } from "express";
import { loginUser } from "../services/authService.js";
import { AppError } from "../middlewares/errorHandler.middleware.js";
import { generateAuthTokens } from "../utills/generateAuthTokens.js";
import jwt from "jsonwebtoken";
import { AuthUser } from "../types/types.js";
import { getUserByUuid } from "../services/userService.js";
import { clearAuthCookies } from "../utills/clearAuthCookies.js";
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../utills/cookieOptions.js";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authTokens = await loginUser(req.body);

    res
      .cookie(
        "accessToken",
        authTokens.data.accessToken,
        ACCESS_TOKEN_COOKIE_OPTIONS,
      )
      .cookie(
        "refreshToken",
        authTokens.data.refreshToken,
        REFRESH_TOKEN_COOKIE_OPTIONS,
      )
      .status(200)
      .json({ message: "Logged in successfully" });
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("No refresh token", 401);
    }

    const decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET!,
    ) as AuthUser;

    const user = await getUserByUuid(decodedToken.uuid);

    if (!user.isActive) {
      throw new AppError("User is not active", 403);
    }

    const newTokens = generateAuthTokens(decodedToken);

    res
      .cookie("accessToken", newTokens.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS)
      .cookie(
        "refreshToken",
        newTokens.refreshToken,
        REFRESH_TOKEN_COOKIE_OPTIONS,
      )
      .json({ message: "Token refreshed" });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req: Request, res: Response) => {
  clearAuthCookies(res);
  res.json({ message: "Logged out successfully" });
};
