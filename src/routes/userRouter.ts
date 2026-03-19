import { Router } from "express";
import { createUserController, deleteUserByCodeController, getUserBycodeController, getUsers, reActiveUserController } from "../controllers/userControllers.js";

const userrouter = Router();

userrouter.get("/", getUsers);
userrouter.get("/by-code/:code", getUserBycodeController)
userrouter.post("/createUser", createUserController)
userrouter.post("/reactive-user", reActiveUserController)
userrouter.post("/delete-user/", deleteUserByCodeController)
export default userrouter;