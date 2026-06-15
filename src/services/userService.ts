import { EntityManager } from "typeorm";
import { CreateUserDto } from "../dto/user/createUserDto.js";
import { GetUserFiltersDto } from "../dto/user/getUserFilter.dto.js";
import { UserResponseDto } from "../dto/user/userResponse.Dto.js";
import { User } from "../entities/user.entity.js";
import { usersRepository } from "../repositories/usersRepository.js";
import { ApiResponse, PaginatedResponse } from "../types/commons.js";
import { AuthTokens, JwtPayload } from "../types/types.js";
import { EMPTY_DATA_COUNT, SALT_ROUNDS } from "../utills/conts.js";
import { pagination } from "../utills/paginate.js";
import { AppError } from "../middelwares/errorsHandler.js";
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

  const query = usersRepository.createQueryBuilder("user");

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
      success: false,
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
  const repository = manager ? manager.getRepository(User) : usersRepository;

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
  const repository = manager ? manager.getRepository(User) : usersRepository;

  const foundUser = await repository.findOneBy({ uuid: userUuid });

  if (!foundUser) {
    throw new AppError("User not found", 404);
  }

  return foundUser;
};

export const createUser = async (
  newUser: CreateUserDto,
): Promise<ApiResponse<UserResponseDto>> => {
  const { email } = newUser;

  const existsEmail = await usersRepository.findOneBy({ email });
  if (existsEmail) {
    throw new AppError("Email already in use", 409);
  }

  const user = usersRepository.create(newUser);
  user.password = await bcrypt.hash(user.password, SALT_ROUNDS);

  await usersRepository.save(user);

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
  email: string,
): Promise<ApiResponse<UserResponseDto>> => {
  const foundUser = await usersRepository.findOneBy({ email });

  if (!foundUser) {
    throw new AppError("User not found", 404);
  }

  if (foundUser.isActive === true) {
    throw new AppError("This user is already active", 409);
  }
  foundUser.isActive = true;

  await usersRepository.save(foundUser);

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

export const deleteUserByEmail = async (
  email: string,
): Promise<ApiResponse<UserResponseDto>> => {
  const foundUser = await usersRepository.findOneBy({ email: email });
  if (!foundUser) {
    throw new AppError("User not found", 404);
  }

  if (foundUser.isActive === false) {
    throw new AppError("This user is already deleted", 400);
  }
  foundUser.isActive = false;

  await usersRepository.save(foundUser);

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
  updateUserData: UpdateUserDto,
  loggedUser: JwtPayload,
): Promise<UpdateUserResult> => {
  const { email, newEmail, name, isAdmin } = updateUserData;

  const user = await getUserByEmail(email);

  if (newEmail && newEmail !== email) {
    const emailInUse = await usersRepository.findOneBy({ email: newEmail });
    if (emailInUse) {
      throw new AppError("Email already in use", 409);
    }
    user.email = newEmail;
  }

  if (name !== undefined) user.name = name;
  if (isAdmin !== undefined) user.isAdmin = isAdmin;

  await usersRepository.save(user);

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

  if (newEmail && loggedUser.email === email) {
    result.newTokens = generateAuthTokens({ ...loggedUser, email: newEmail });
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

  await usersRepository.save(user);

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
