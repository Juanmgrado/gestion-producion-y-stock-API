import { LoginUserDto } from "../dto/user/loginUser.dto.js";
import { AppError } from "../middlewares/errorHandler.middleware.js";
import { AuthTokens } from "../types/types.js";
import { getUserByEmail } from "./userService.js";
import * as bcrypt from "bcrypt";
import { generateAuthTokens } from "../utills/generateAuthTokens.js";
import { ApiResponse } from "../types/common.js";

export const loginUser = async (
  loginUserDto: LoginUserDto,
): Promise<ApiResponse<AuthTokens>> => {
  const { password } = loginUserDto;

  const user = await getUserByEmail(loginUserDto.email);

  if (!user.isActive) {
    throw new AppError("The user is not active. Contact an admin.", 403);
  }

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new AppError("User or password incorrect", 401);
  }

  const authTokens: AuthTokens = generateAuthTokens(user);

  return { success: true, message: "Logged in successfully", data: authTokens };
};
