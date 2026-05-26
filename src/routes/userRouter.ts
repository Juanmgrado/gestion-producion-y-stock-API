import { Router } from "express";
import {
  createUserController,
  deleteUserByEmailController,
  getUsers,
  reActiveUserController,
  getUserByEmailController,
} from "../controllers/userControllers.js";
import { validateDto } from "../middelwares/validateDto.middleware.js";
import { CreateUserDto } from "../dto/user/createUserDto.js";
import { verifyToken } from "../middelwares/verifyToken.middleware.js";
import { verifyAdmin } from "../middelwares/verifyIsAdmin.middleware.js";

const userrouter = Router();

userrouter.get("/", verifyToken, verifyAdmin, getUsers);
userrouter.get("/getuser", verifyToken, verifyAdmin, getUserByEmailController);
userrouter.post(
  "/createUser",
  validateDto(CreateUserDto),
  createUserController,
);
userrouter.post(
  "/reactive-user",
  verifyToken,
  verifyAdmin,
  reActiveUserController,
);
userrouter.post(
  "/delete-user",
  verifyToken,
  verifyAdmin,
  deleteUserByEmailController,
);
export default userrouter;
