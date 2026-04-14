import { User } from "../entities/user.entity.js";
import { usersRepository } from "../repositories/usersRepository.js";
import { UserFilters } from "../types/filters.js";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../utills/conts.js";

export const getAllUsers = async (filters: UserFilters = {}) => {
  const { name, email, code, isAdmin, isActive, sortBy, order, page, limit } =
    filters;

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

  if (code !== undefined) {
    query.andWhere("user.code = :code", { code });
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

  const pageNumber = page ?? DEFAULT_PAGE;
  const take = limit ?? DEFAULT_LIMIT;
  const skip = (pageNumber - 1) * take;

  query.take(take).skip(skip);

  const users = await query.getMany();

  return users;
};

export const getuserById = async (userId: string, manager?: any) => {
  const repo = manager ? manager.getRepository(User) : usersRepository;

  const foundUser = await repo.findOneBy({ id: userId });

  if (!foundUser) {
    throw new Error("User not found");
  }

  return foundUser;
};

export const createUser = async (newUser: any) => {
  const user = usersRepository.create(newUser);
  const { email, code } = newUser;
  const existsEmail = await usersRepository.findOneBy({ email });
  if (existsEmail) {
    throw new Error("Email already in use");
  }
  const existsCode = await usersRepository.findOneBy({ code });
  if (existsCode) {
    throw new Error("Code already in use");
  }
  await usersRepository.save(user);
  return user;
};

export const reActiveUser = async (code: any) => {
  const foundUser = await usersRepository.findOneBy({ code });

  if (!foundUser) {
    throw new Error("User not found");
  }

  if (foundUser.isActive === true) {
    throw new Error("This user is already active");
  }
  foundUser.isActive = true;

  await usersRepository.save(foundUser);

  return { message: "User activated successfully" };
};

export const deleteUserByCode = async (code: number) => {
  const foundUser = await usersRepository.findOneBy({ code: code });
  if (!foundUser) {
    throw new Error("User not found");
  }

  if (foundUser.isActive === false) {
    throw new Error("This user is already deleted");
  }
  foundUser.isActive = false;

  await usersRepository.save(foundUser);

  return { message: "User deleted susecfully" };
};
