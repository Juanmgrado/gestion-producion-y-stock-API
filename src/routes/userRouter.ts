import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getUsers,
  reActiveUserController,
  getUserByUuidController,
  updateUserController,
} from "../controllers/userController.js";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import { CreateUserDto } from "../dto/user/createUser.dto.js";
import { UpdateUserDto } from "../dto/user/updateUser.dto.js";

const userrouter = Router();

userrouter.get("/", getUsers);
userrouter.get("/:uuid", getUserByUuidController);
userrouter.post("/", validateDto(CreateUserDto), createUserController);
userrouter.patch("/:uuid", validateDto(UpdateUserDto), updateUserController);
userrouter.patch("/:uuid/reactivate", reActiveUserController);
userrouter.delete("/:uuid", deleteUserController);

export default userrouter;
