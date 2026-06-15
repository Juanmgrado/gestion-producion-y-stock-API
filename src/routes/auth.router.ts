import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshTokenController,
} from "../controllers/auth.controller.js";
import { validateDto } from "../middelwares/validateDto.middleware.js";
import { LoginUserDto } from "../dto/user/loginUser.dto.js";
import { verifyToken } from "../middelwares/verifyToken.middleware.js";
import { ChangePasswordDto } from "../dto/user/changePassword.dto.js";
import { changeUserPasswordController } from "../controllers/userControllers.js";

const authRouter = Router();

authRouter.post("/login", validateDto(LoginUserDto), loginController);
authRouter.post("/refresh", refreshTokenController);
authRouter.post("/logout", verifyToken, logoutController);
authRouter.patch(
  "/change-password",
  verifyToken,
  validateDto(ChangePasswordDto),
  changeUserPasswordController,
);
export default authRouter;
