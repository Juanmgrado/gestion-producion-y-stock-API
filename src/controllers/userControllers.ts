import { Request, Response } from "express";
import {
  createUser,
  deleteUserByCode,
  getAllUsers,
  getuserByCode,
  reActiveUser,
} from "../services/userService.js";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error getting users" });
  }
};

export const getUserBycodeController = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({
        message: "Please, insert a valid number code",
      });
    }
    const foundUser = await getuserByCode(code);
    return res.status(200).json(foundUser);
  } catch (error: any) {
    console.error("Error getting user by code:", error);

    if (error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const createUserController = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    if (!user.name || !user.email || !user.code) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const createdUser = await createUser(user);
    return res
      .status(200)
      .json({ createdUser, message: "User created successfully" });
  } catch (error: any) {
    console.error("Error creatting user", error);

    if (error.message === "Email already in use") {
      return res.status(409).json({ message: "Email already in use" });
    }
    if (error.message === "Code already in use") {
      return res.status(409).json({ message: "Code already in use" });
    }
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const reActiveUserController = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== "number") {
      return res.status(400).json({
        message: "Insert a Valid employee code",
      });
    }
    await reActiveUser(code);
    return res.status(200).json({ message: "User activated successfully" });
  } catch (error: any) {
    console.error("Error activating user", error);
    if (error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }
    if (error.message === "This user is already active") {
      res.status(400).json({ message: "This user is already active" });
    }
  }
};

export const deleteUserByCodeController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({
        message: "Insert an employee code",
      });
    }
    if (typeof code !== "number") {
      return res.status(400).json({
        message: "Please, insert a valid number code",
      });
    }
    await deleteUserByCode(code);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Error deletting user by code:", error);

    if (error.message === "User not found") {
      return res.status(404).json(error.message);
    }

    if (error.message === "This user was already deleted") {
      return res.status(404).json(error.message);
    }
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
