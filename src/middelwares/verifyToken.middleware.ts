import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/types.js";
import { getUserByEmail } from "../services/userService.js";
import { clearAuthCookies } from "../utills/clearAuthCookies.js";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken: string = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        message: "Access denied",
      });
    }

    const decodedToken = jwt.verify(
      accessToken,
      process.env.JWT_SECRET!,
    ) as JwtPayload;

    const user = await getUserByEmail(decodedToken.email);
    if (!user || !user.isActive) {
      clearAuthCookies(res);
      return res
        .status(403)
        .json({ message: "The user is not active. Contact an admin." });
    }
    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
