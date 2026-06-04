import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/dataSource.js";
import apiRouter from "./routes/indexs.js";
import createProductsList from "./utills/createProducts.js";
import createUserAdmin from "./utills/createUserAdmin.js";
import { env } from "./config/dotenv.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middelwares/errorsHandler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Server on" });
});
app.use("/api", apiRouter);
app.use(errorHandler)

try {
  await AppDataSource.initialize();
  console.log("Data Source has been initialized!");
  
  await createUserAdmin()
  await createProductsList()

  app.listen(env.PORT, () => {
    console.log(`Server running at port: ${env.PORT}`);
  });

} catch (error) {
  console.error("Error during Data Source initialization", error);
}

