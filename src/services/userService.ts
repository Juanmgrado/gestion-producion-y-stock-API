import { EntityManager } from "typeorm";
import { CreateUserDto } from "../dto/user/createUser.dto.js";
import { GetUserFiltersDto } from "../dto/user/getUserFilters.dto.js";
import { UserResponseDto } from "../dto/user/userResponse.dto.js";
import { User } from "../entities/user.entity.js";
import { userRepository } from "../repositories/userRepository.js";
import { ApiResponse, PaginatedResponse } from "../types/common.js";
import { AuthTokens, JwtPayload } from "../types/types.js";
import { EMPTY_DATA_COUNT, SALT_ROUNDS } from "../utills/consts.js";
import { pagination } from "../utills/paginate.js";
import { AppError } from "../middlewares/errorHandler.middleware.js";
import { generateAuthTokens } from "../utills/generateAuthTokens.js";
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from "../dto/user/updateUser.dto.js";
import { ChangeUserPasswordInput } from "../types/inputs.js";

export type UpdateUserResult = ApiResponse<UserResponseDto> & {
  newTokens?: AuthTokens;
};

export const getAllUsers = async (
  userFilters: Partial<GetUserFiltersDto> = {},
): Promise<PaginatedResponse<UserResponseDto>> => {
  const { name, email, isAdmin, isActive, sortBy, order, page, limit } =
    userFilters;

  const query = userRepository.createQueryBuilder("user");

  if (name) {
    query.andWhere("user.name ILIKE :name", {
      name: `%${name}%`,
    });
  }

  if (email) {
    query.andWhere("user.email ILIKE :email", {
      email: `%${email}%`,
    });
  }

  if (isAdmin !== undefined) {
    query.andWhere("user.isAdmin = :isAdmin", { isAdmin });
  }

  if (isActive !== undefined) {
    query.andWhere("user.isActive = :isActive", { isActive });
  }

  if (sortBy) {
    query.orderBy(`user.${sortBy}`, order === "ASC" ? "ASC" : "DESC");
  }

  const paginationValues = pagination(page, limit);

  query.take(paginationValues.limit);
  query.skip(paginationValues.skip);

  const [data, total] = await query.getManyAndCount();

  const users: UserResponseDto[] = data.map((user) => ({
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isActive: user.isActive,
  }));

  if (data.length === EMPTY_DATA_COUNT) {
    return {
      success: true,
      message: "No users found",
      total: 0,
      page: paginationValues.page,
      limit: paginationValues.limit,
      totalPages: Math.ceil(total / paginationValues.limit),
      data: users,
    };
  }

  return {
    success: true,
    message: "Users retrieved successfully",
    total,
    page: paginationValues.page,
    limit: paginationValues.limit,
    totalPages: Math.ceil(total / paginationValues.limit),
    data: users,
  };
};

export const getUserByEmail = async (
  userEmail: string,
  manager?: EntityManager,
): Promise<User> => {
  const repository = manager ? manager.getRepository(User) : userRepository;

  const foundUser = await repository.findOneBy({ email: userEmail });

  if (!foundUser) {
    throw new AppError("User not found", 404);
  }

  return foundUser;
};

export const getUserByUuid = async (
  userUuid: string,
  manager?: EntityManager,
): Promise<User> => {
  const repository = manager ? manager.getRepository(User) : userRepository;

  const foundUser = await repository.findOneBy({ uuid: userUuid });

  if (!foundUser) {
    throw new AppError("User not found", 404);
  }

  return foundUser;
};

export const getUserResponseByUuid = async (
  userUuid: string,
): Promise<ApiResponse<UserResponseDto>> => {
  const user = await getUserByUuid(userUuid);

  return {
    success: true,
    message: "User found successfully",
    data: {
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
    },
  };
};

export const createUser = async (
  newUser: CreateUserDto,
): Promise<ApiResponse<UserResponseDto>> => {
  const { email } = newUser;

  const existsEmail = await userRepository.findOneBy({ email });
  if (existsEmail) {
    throw new AppError("Email already in use", 409);
  }

  const user = userRepository.create(newUser);
  user.password = await bcrypt.hash(user.password, SALT_ROUNDS);

  await userRepository.save(user);

  const userResponse: UserResponseDto = {
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isActive: user.isActive,
  };

  return {
    success: true,
    message: "User created successfully",
    data: userResponse,
  };
};

export const reActiveUser = async (
  userUuid: string,
): Promise<ApiResponse<UserResponseDto>> => {
  const foundUser = await getUserByUuid(userUuid);

  if (foundUser.isActive === true) {
    throw new AppError("This user is already active", 409);
  }
  foundUser.isActive = true;

  await userRepository.save(foundUser);

  const userResponse: UserResponseDto = {
    uuid: foundUser.uuid,
    email: foundUser.email,
    name: foundUser.name,
    isAdmin: foundUser.isAdmin,
    isActive: foundUser.isActive,
  };

  return {
    success: true,
    message: "User activated successfully",
    data: userResponse,
  };
};

export const deleteUser = async (
  userUuid: string,
  requesterUuid: string,
): Promise<ApiResponse<UserResponseDto>> => {
  if (userUuid === requesterUuid) {
    throw new AppError("You cannot deactivate your own account", 409);
  }

  const foundUser = await getUserByUuid(userUuid);

  if (foundUser.isActive === false) {
    throw new AppError("This user is already deleted", 400);
  }
  foundUser.isActive = false;

  await userRepository.save(foundUser);

  const userResponse: UserResponseDto = {
    uuid: foundUser.uuid,
    email: foundUser.email,
    name: foundUser.name,
    isAdmin: foundUser.isAdmin,
    isActive: foundUser.isActive,
  };

  return {
    success: true,
    message: "User deleted successfully",
    data: userResponse,
  };
};

export const updateUser = async (
  userUuid: string,
  updateUserData: UpdateUserDto,
  loggedUser: JwtPayload,
): Promise<UpdateUserResult> => {
  const { email, name, isAdmin } = updateUserData;

  if (isAdmin === false && userUuid === loggedUser.uuid) {
    throw new AppError("You cannot remove your own admin role", 409);
  }

  const user = await getUserByUuid(userUuid);

  let emailChanged = false;
  if (email && email !== user.email) {
    const emailInUse = await userRepository.findOneBy({ email });
    if (emailInUse) {
      throw new AppError("Email already in use", 409);
    }
    user.email = email;
    emailChanged = true;
  }

  if (name !== undefined) user.name = name;
  if (isAdmin !== undefined) user.isAdmin = isAdmin;

  await userRepository.save(user);

  const userResponse: UserResponseDto = {
    uuid: user.uuid,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
    isActive: user.isActive,
  };

  const result: UpdateUserResult = {
    success: true,
    message: "User updated successfully",
    data: userResponse,
  };

  // Reissue tokens if the logged-in user changed their own email
  if (emailChanged && loggedUser.uuid === userUuid) {
    result.newTokens = generateAuthTokens({ ...loggedUser, email: user.email });
  }

  return result;
};

export const changeUserPassword = async (
  changeUserPasswordInput: ChangeUserPasswordInput,
): Promise<UpdateUserResult> => {
  const { email } = changeUserPasswordInput;
  const { currentPassword, newPassword } =
    changeUserPasswordInput.changePasswordData;
  const user = await getUserByEmail(email);

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    throw new AppError("Passwords do not match", 409);
  }

  const newPasswordHashed = await bcrypt.hash(newPassword, SALT_ROUNDS);

  user.password = newPasswordHashed;

  await userRepository.save(user);

  const userResponse: UserResponseDto = {
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isActive: user.isActive,
  };

  return {
    success: true,
    message: "Password changed correctly",
    data: userResponse,
    newTokens: generateAuthTokens(user),
  };
};
