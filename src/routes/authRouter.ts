import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshTokenController,
} from "../controllers/authController.js";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import { LoginUserDto } from "../dto/user/loginUser.dto.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { ChangePasswordDto } from "../dto/user/changePassword.dto.js";
import { changeUserPasswordController, getCurrentUserController } from "../controllers/userController.js";
import { loginLimiter } from "../middlewares/rateLimit.middleware.js";

const authRouter = Router();

authRouter.get("/me", verifyToken, getCurrentUserController);
authRouter.post(
  "/login",
  loginLimiter,
  validateDto(LoginUserDto),
  loginController,
);
authRouter.post("/refresh", refreshTokenController);
authRouter.post("/logout", verifyToken, logoutController);
authRouter.patch(
  "/change-password",
  verifyToken,
  validateDto(ChangePasswordDto),
  changeUserPasswordController,
);
export default authRouter;
