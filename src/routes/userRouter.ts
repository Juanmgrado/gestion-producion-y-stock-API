import { Router } from "express";
import { createUserController, deleteUserByCodeController, getUserByIdController, getUsers, reActiveUserController } from "../controllers/userControllers.js";

const userrouter = Router();

userrouter.get("/", getUsers);
userrouter.get("/getuser", getUserByIdController);
userrouter.post("/createUser", createUserController)
userrouter.post("/reactive-user", reActiveUserController)
userrouter.post("/delete-user", deleteUserByCodeController)
export default userrouter;