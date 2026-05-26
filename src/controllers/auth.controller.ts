import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service.js";
import { generateAuthTokens } from "../utills/generateAuthTokens.js";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { AuthUser } from "../types/types.js";
import { getUserByEmail } from "../services/userService.js";
import { clearAuthCookies } from "../utills/clearAuthCookies.js";

export const registerController = async (req: Request, res: Response) => {
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
    res.status(400).json({ message: (error as Error).message });
  }
};

export const loginController = async (req: Request, res: Response) => {
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
    res.status(400).json({ message: (error as Error).message });
  }
};

export const refreshTokenController = async (req: Request, res: Response) => {
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
      throw new Error("User is not active");
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
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  clearAuthCookies(res);
  res.json({ message: "Logged out successfully" });
};
