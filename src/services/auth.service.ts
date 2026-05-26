import { CreateUserDto } from "../dto/user/createUserDto.js";
import { LoginUserDto } from "../dto/user/loginUser.dto.js";
import { AuthTokens, JwtPayload } from "../types/types.js";
import { SALT_ROUNDS } from "../utills/conts.js";
import { createUser, getUserByEmail } from "./userService.js";
import * as bcrypt from "bcrypt";
import { generateAuthTokens } from "../utills/generateAuthTokens.js";

export const registerUser = async (
  registerDto: CreateUserDto,
): Promise<AuthTokens> => {
  const { password } = registerDto;

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const userToCreate = { ...registerDto, password: hashedPassword };

  const user = await createUser(userToCreate);

  const authTokens: AuthTokens = generateAuthTokens(user);

  return authTokens;
};

export const loginUser = async (
  loginUserDto: LoginUserDto,
): Promise<AuthTokens> => {
  const { password } = loginUserDto;

  const user = await getUserByEmail(loginUserDto.email);

  if (!user) {
    throw new Error("User or password incorrect");
  }

  if(!user.isActive){
    throw new Error("The user is not active. Contact an admin.")
  }

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("User or password incorrect");
  }

  const authTokens: AuthTokens = generateAuthTokens(user);

  return authTokens;
};
