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

userrouter.get("/", getUsers);
userrouter.get("/getuser", getUserByEmailController);
userrouter.post(
  "/createUser",
  validateDto(CreateUserDto),
  createUserController,
);
userrouter.post("/reactive-user", reActiveUserController);
userrouter.post("/delete-user", deleteUserByEmailController);
export default userrouter;
