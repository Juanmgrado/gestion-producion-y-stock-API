import { Router } from "express";
import {
  createUserController,
  deleteUserByEmailController,
  getUsers,
  reActiveUserController,
  getUserByUuidController,
  updateUserController,
} from "../controllers/userControllers.js";
import { validateDto } from "../middelwares/validateDto.middleware.js";
import { CreateUserDto } from "../dto/user/createUserDto.js";
import { UpdateUserDto } from "../dto/user/updateUser.dto.js";
import { ReactivateUserDto } from "../dto/user/reactivateUser.dto.js";

const userrouter = Router();

userrouter.get("/", getUsers);
userrouter.get("/:uuid", getUserByUuidController);
userrouter.post(
  "/createUser",
  validateDto(CreateUserDto),
  createUserController,
);
userrouter.patch("/reactive-user", validateDto(ReactivateUserDto), reActiveUserController);
userrouter.delete("/delete-user", deleteUserByEmailController);
userrouter.patch(
  "/update-user",
  validateDto(UpdateUserDto),
  updateUserController,
);
export default userrouter;
