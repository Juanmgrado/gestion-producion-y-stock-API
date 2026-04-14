import { AppDataSource } from "../config/dataSource.js";
import { User } from "../entities/user.entity.js";
import { usersRepository } from "../repositories/usersRepository.js";

 export default async function createUserAdmin(){
    const adminExists = await usersRepository.existsBy({ isAdmin: true });
  if (!adminExists) {
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(User)
      .values([{ name: "Admin", email: "Saw", code: 5246, isAdmin: true }])
      .execute();
    console.log("Created new admin user");
  } else {
    console.log("Admin user already exists");
  }
}