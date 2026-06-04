import { NextFunction, Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service.js";
import { AppError } from "../middelwares/errorsHandler.js";
import { generateAuthTokens } from "../utills/generateAuthTokens.js";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { AuthUser } from "../types/types.js";
import { getUserByEmail } from "../services/userService.js";
import { clearAuthCookies } from "../utills/clearAuthCookies.js";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authTokens = await registerUser(req.body);

    res
      .cookie("accessToken", authTokens.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", authTokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 72 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authTokens = await loginUser(req.body);

    res
      .cookie("accessToken", authTokens.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", authTokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 72 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ message: "User logued" });
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET!,
    ) as AuthUser;

    const user = await getUserByEmail(decodedToken.email);

    if (!user.isActive) {
      throw new AppError("User is not active", 403);
    }

    const newTokens = generateAuthTokens(decodedToken);

    res
      .cookie("accessToken", newTokens.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", newTokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 72 * 60 * 60 * 1000,
      })
      .json({ message: "Token refreshed" });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req: Request, res: Response) => {
  clearAuthCookies(res);
  res.json({ message: "Logged out successfully" });
};
