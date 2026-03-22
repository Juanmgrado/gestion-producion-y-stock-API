import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/dataSource.js";
import { User } from "./entities/user.entity.js";
import { usersRepository } from "./repositories/usersRepository.js";
import apiRouter from "./routes/indexs.js";

const app = express();
const PORT: number = 5003;
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server on" });
});

app.use("/api", apiRouter);
try {
  await AppDataSource.initialize();
  console.log("Data Source has been initialized!");
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
  app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`);
  });
} catch (error) {
  console.error("Error during Data Source initialization", error);
}

