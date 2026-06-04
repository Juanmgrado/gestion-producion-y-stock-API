import { NextFunction, Request, Response } from "express";
import {
  createUser,
  deleteUserByEmail,
  getAllUsers,
  getUserByEmail,
  reActiveUser,
} from "../services/userService.js";
import { GetUserFiltersDto } from "../dto/user/getUserFilter.dto.js";
import { Order, UserSortBy } from "../types/enums.js";
import { DEFAULT_PAGE, LIMIT_PAGE } from "../utills/conts.js";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    next(error);
  }
};

export const getUserByEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Please, insert a valid id",
      });
    }
    const foundUser = await getUserByEmail(email);
    return res.status(200).json(foundUser);
  } catch (error: any) {
    next(error);
  }
};

export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.body;

    const createdUser = await createUser(user);
    return res
      .status(200)
      .json({ createdUser, message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const reActiveUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    next(error);
  }
};

export const deleteUserByEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
  } catch (error) {
    next(error);
  }
};
