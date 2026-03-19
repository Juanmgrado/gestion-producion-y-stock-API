import { User } from "../entities/user.entity.js";
import { usersRepository } from "../repositories/usersRepository.js";

export const getAllUsers = async () => {
  const allUsers = usersRepository.find();
  if (!allUsers) {
    throw new Error("Not users");
  }

  return allUsers;
};

export const getuserByCode = async (code: any) => {
  const foundUser = await usersRepository.findOneBy({ code: code });
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
    throw new Error("This user is already active" );
  }
  foundUser.isActive = true;

  await usersRepository.save(foundUser)

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
