import { Router } from "express";
import {
  createUserController,
  deleteUserByEmailController,
  getUserByIdController,
  getUsers,
  reActiveUserController,
} from "../controllers/userControllers.js";
import { validateDto } from "../middelwares/validateDto.middelware.js";
import { CreateUserDto } from "../dto/user/createUserDto.js";

const userrouter = Router();

userrouter.get("/", getUsers);
userrouter.get("/getuser", getUserByIdController);
userrouter.post(
  "/createUser",
  validateDto(CreateUserDto),
  createUserController,
);
userrouter.post("/reactive-user", reActiveUserController);
userrouter.post("/delete-user", deleteUserByEmailController);
export default userrouter;
