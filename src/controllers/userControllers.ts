import { Request, Response } from "express";
import {
  createUser,
  deleteUserByCode,
  getAllUsers,
  getuserById,
  reActiveUser,
} from "../services/userService.js";
import { UserFilters } from "../types/filters.js";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const usersFilters: UserFilters = {
      ...(req.query.name && { name: req.query.name as string }),
      ...(req.query.email && { email: req.query.email as string }),
      ...(req.query.code && { code: Number(req.query.code) }),
      ...(req.query.isAdmin !== undefined && {
        isAdmin: req.query.isAdmin === "true",
      }),
      ...(req.query.isActive !== undefined && {
        isActive: req.query.isActive === "true",
      }),
      ...(req.query.sortBy && { sortBy: req.query.sortBy as any }),
      ...(req.query.order && { order: req.query.order as any }),
      ...(req.query.page && { page: Number(req.query.page) }),
      ...(req.query.limit && { limit: Number(req.query.limit) }),
    };
    const users = await getAllUsers(usersFilters);
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error getting users" });
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        message: "Please, insert a valid id",
      });
    }
    const foundUser = await getuserById(id);
    return res.status(200).json(foundUser);
  } catch (error: any) {
    console.error("Error getting user by id:", error);

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
