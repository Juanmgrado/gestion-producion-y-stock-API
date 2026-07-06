import { NextFunction, Request, Response } from "express";
import {
  changeUserPassword,
  createUser,
  deleteUser,
  getAllUsers,
  getUserResponseByUuid,
  reActiveUser,
  updateUser,
} from "../services/userService.js";
import { GetUserFiltersDto } from "../dto/user/getUserFilters.dto.js";
import { Order, UserSortBy } from "../types/enums.js";
import { DEFAULT_PAGE, LIMIT_PAGE } from "../utills/consts.js";
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../utills/cookieOptions.js";
import { UpdateUserDto } from "../dto/user/updateUser.dto.js";
import { ChangePasswordDto } from "../dto/user/changePassword.dto.js";
import { GetUserByUuidRequest, UpdateUserRequest } from "../types/requests.js";

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
      page: parseInt(req.query.page as string, 10) || DEFAULT_PAGE,
      limit: parseInt(req.query.limit as string, 10) || LIMIT_PAGE,
    };

    const users = await getAllUsers(usersFilters);
    return res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserByUuidController = async (
  req: GetUserByUuidRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { uuid } = req.params;
    const result = await getUserResponseByUuid(uuid);
    return res.status(200).json(result);
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

    const result = await createUser(user);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const reActiveUserController = async (
  req: GetUserByUuidRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { uuid } = req.params;
    const result = await reActiveUser(uuid);
    return res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const deleteUserController = async (
  req: GetUserByUuidRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { uuid } = req.params;
    const result = await deleteUser(uuid);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (
  req: UpdateUserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { uuid } = req.params;
    const updateUserData: UpdateUserDto = req.body;
    const { newTokens, ...result } = await updateUser(
      uuid,
      updateUserData,
      req.user!,
    );

    if (newTokens) {
      res
        .cookie(
          "accessToken",
          newTokens.accessToken,
          ACCESS_TOKEN_COOKIE_OPTIONS,
        )
        .cookie(
          "refreshToken",
          newTokens.refreshToken,
          REFRESH_TOKEN_COOKIE_OPTIONS,
        );
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const changeUserPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.user!;
    const changePasswordData: ChangePasswordDto = req.body;
    const { newTokens, ...result } = await changeUserPassword({
      email,
      changePasswordData,
    });

    res
      .cookie(
        "accessToken",
        newTokens!.accessToken,
        ACCESS_TOKEN_COOKIE_OPTIONS,
      )
      .cookie(
        "refreshToken",
        newTokens!.refreshToken,
        REFRESH_TOKEN_COOKIE_OPTIONS,
      );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
