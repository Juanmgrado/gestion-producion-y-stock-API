import { AppDataSource } from "../config/dataSource.js";
import { User } from "../entities/user.entity.js";
import { usersRepository } from "../repositories/usersRepository.js";
import  bcrypt  from "bcrypt";
import { SALT_ROUNDS } from "./conts.js";

 export default async function createUserAdmin(){
    const adminExists = await usersRepository.existsBy({ isAdmin: true });
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new Error("ADMIN_PASSWORD is missing");
    }
  if (!adminExists) {
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          name: "Admin",
          email: "user@admind.com",
          password: await bcrypt.hash(adminPassword, SALT_ROUNDS),
          isAdmin: true,
        },
      ])
      .execute();
    console.log("Created new admin user");
  } else {
    console.log("Admin user already exists");
  }
}