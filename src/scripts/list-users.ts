/**
 * Maintenance utility: prints all registered users (without password hashes).
 *
 * Useful for inspecting the database state (e.g. checking which accounts are
 * admins or inactive) without connecting to PostgreSQL manually.
 *
 * Usage:
 *   npm run users:list
 */
import "reflect-metadata";
import { AppDataSource } from "../config/dataSource.js";
import { User } from "../entities/user.entity.js";

async function main() {
  await AppDataSource.initialize();

  const users = await AppDataSource.getRepository(User).find({
    select: ["uuid", "name", "email", "isAdmin", "isActive"],
  });

  console.log("Registered users:", JSON.stringify(users, null, 2));

  await AppDataSource.destroy();
}

main().catch((error) => {
  console.error("Error listing users:", error);
  process.exit(1);
});
