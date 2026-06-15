import { NextFunction, Request, Response } from "express";
import {
  changeUserPassword,
  createUser,
  deleteUserByEmail,
  getAllUsers,
  getUserByUuid,
  reActiveUser,
  updateUser,
} from "../services/userService.js";
import { GetUserFiltersDto } from "../dto/user/getUserFilter.dto.js";
import { Order, UserSortBy } from "../types/enums.js";
import { DEFAULT_PAGE, LIMIT_PAGE } from "../utills/conts.js";
import { ACCESS_TOKEN_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_OPTIONS } from "../utills/cookieOptions.js";
import { UpdateUserDto } from "../dto/user/updateUser.dto.js";
import { ChangePasswordDto } from "../dto/user/changePassword.dto.js";
import { AppError } from "../middelwares/errorsHandler.js";
import { GetUserByUuidRequest } from "../types/requests.js";

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
    const user = await getUserByUuid(uuid);
    return res.status(200).json({
      success: true,
      message: "User found successfully",
      data: {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
      },
    });
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
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const result = await reActiveUser(email);
    return res.status(200).json(result);
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
    const { email } = req.query;
    if (!email) {
      throw new AppError("Please, insert a valid email", 400);
    }
    const result = await deleteUserByEmail(email as string);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updateUserData: UpdateUserDto = req.body;
    const { newTokens, ...result } = await updateUser(
      updateUserData,
      req.user!,
    );

    if (newTokens) {
      res
        .cookie("accessToken", newTokens.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS)
        .cookie("refreshToken", newTokens.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
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
      .cookie("accessToken", newTokens!.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS)
      .cookie("refreshToken", newTokens!.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
