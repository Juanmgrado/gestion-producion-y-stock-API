import { User } from "../entities/user.entity.js";
import { AuthTokens, AuthUser, JwtPayload } from "../types/types.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const generateAuthTokens = (user: AuthUser): AuthTokens => {
  const payload: JwtPayload = {
    uuid: user.uuid,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  const accessToken: string = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  const refreshToken: string = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "72h",
  });

  return { accessToken, refreshToken };
};
