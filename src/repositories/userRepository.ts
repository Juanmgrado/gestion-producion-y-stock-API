import { AppDataSource } from "../config/dataSource.js";
import { User } from "../entities/user.entity.js";

export const userRepository =  AppDataSource.getRepository(User)