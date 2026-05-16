import { EntityManager } from "typeorm";
import { CreateUserDto } from "../dto/user/createUserDto.js";
import { GetUserFiltersDto } from "../dto/user/getUserFilter.dto.js";
import { UserResponseDto } from "../dto/user/userResponse.Dto.js";
import { User } from "../entities/user.entity.js";
import { usersRepository } from "../repositories/usersRepository.js";
import { ApiResponse, PaginatedResponse } from "../types/commons.js";
import { EMPTY_DATA_COUNT } from "../utills/conts.js";
import { pagination } from "../utills/paginate.js";
import { UserEmail } from "../types/interfaces.js";

export const getAllUsers = async (
  userFilters: Partial<GetUserFiltersDto> = {},
): Promise<PaginatedResponse<UserResponseDto>> => {
  const { name, email, isAdmin, isActive, sortBy, order, page, limit } =
    userFilters;

  const query = usersRepository
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.products", "product");

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
      message: "Not users registered",
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

export const getuserById = async (
  userUuid: string,
  manager?: EntityManager,
): Promise<UserResponseDto> => {
  const repository = manager ? manager.getRepository(User) : usersRepository;

  const foundUser = await repository.findOneBy({ uuid: userUuid });

  if (!foundUser) {
    throw new Error("User not found");
  }

  return foundUser;
};

export const createUser = async (
  newUser: CreateUserDto,
): Promise<ApiResponse<UserResponseDto>> => {
  const { email, code } = newUser;
  const existsEmail = await usersRepository.findOneBy({ email });
  if (existsEmail) {
    throw new Error("Email already in use");
  }
  const existsCode = await usersRepository.findOneBy({ email });
  if (existsCode) {
    throw new Error("Code already in use");
  }
  const user = usersRepository.create(newUser);
  await usersRepository.save(user);

  const userResponse: UserResponseDto = {
    uuid: user.uuid,
    email: user.email,
    name: user.name,
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
    throw new Error("User not found");
  }

  if (foundUser.isActive === true) {
    throw new Error("This user is already active");
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
    throw new Error("User not found");
  }

  if (foundUser.isActive === false) {
    throw new Error("This user is already deleted");
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
    message: "User deleted susecfully",
    data: userResponse,
  };
};
