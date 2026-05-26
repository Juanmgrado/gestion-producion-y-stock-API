import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
} from "../controllers/auth.controller.js";
import { validateDto } from "../middelwares/validateDto.middleware.js";
import { CreateUserDto } from "../dto/user/createUserDto.js";
import { LoginUserDto } from "../dto/user/loginUser.dto.js";
import { verifyToken } from "../middelwares/verifyToken.middleware.js";

const authRouter = Router();

authRouter.post("/register", validateDto(CreateUserDto), registerController);
authRouter.post("/login", validateDto(LoginUserDto), loginController);
authRouter.post("/refresh", refreshTokenController);
authRouter.post("/logout", verifyToken, logoutController);
export default authRouter;
