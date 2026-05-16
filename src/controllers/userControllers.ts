import { Request, Response } from "express";
import {
  createUser,
  deleteUserByEmail,
  getAllUsers,
  getuserById,
  reActiveUser,
} from "../services/userService.js";
import { GetUserFiltersDto } from "../dto/user/getUserFilter.dto.js";
import { Order, UserSortBy } from "../types/enums.js";
import { DEFAULT_PAGE, LIMIT_PAGE } from "../utills/conts.js";

export const getUsers = async (req: Request, res: Response) => {
  try {
  const usersFilters: GetUserFiltersDto = {
  name: req.query.name as string | undefined,
  email: req.query.email as string | undefined,
  isActive:
    req.query.isActive === "true"
      ? true
      : req.query.isActive === "false"
      ? false
      : undefined,
  isAdmin:
    req.query.isAdmin === "true"
      ? true
      : req.query.isAdmin === "false"
      ? false
      : undefined,
  sortBy: Object.values(UserSortBy).includes(req.query.sortBy as UserSortBy)
    ? (req.query.sortBy as UserSortBy)
    : undefined,
  order: Object.values(Order).includes(req.query.order as Order)
    ? (req.query.order as Order)
    : undefined,
  page: req.query.page ? Number(req.query.page) : DEFAULT_PAGE,
  limit: req.query.limit ? Number(req.query.limit) : LIMIT_PAGE,
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
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        message: "Insert a Valid employee code",
      });
    }
    await reActiveUser(email);
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

export const deleteUserByEmailController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Insert an employee code",
      });
    }
    if (typeof email !== "string") {
      return res.status(400).json({
        message: "Please, insert a valid number code",
      });
    }
    await deleteUserByEmail(email);
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
