import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/dataSource.js";
import apiRouter from "./routes/indexs.js";
import createProductsList from "./utills/createProducts.js";
import createUserAdmin from "./utills/createUserAdmin.js";

const app = express();
const PORT: number = 5004;
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server on" });
});

app.use("/api", apiRouter);
try {
  await AppDataSource.initialize();
  console.log("Data Source has been initialized!");
  await createUserAdmin()
  await createProductsList()
  app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`);
  });
} catch (error) {
  console.error("Error during Data Source initialization", error);
}

