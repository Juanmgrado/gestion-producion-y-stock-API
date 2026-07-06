import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/dataSource.js";
import apiRouter from "./routes/index.js";
import createProductsList from "./utills/createProducts.js";
import createUserAdmin from "./utills/createUserAdmin.js";
import { env } from "./config/dotenv.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { globalLimiter } from "./middlewares/rateLimit.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(globalLimiter);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.json({ message: "Server on" });
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRouter);
app.use(errorHandler);

try {
  await AppDataSource.initialize();
  console.log("Data Source has been initialized!");

  await createUserAdmin();
  await createProductsList();

  app.listen(env.PORT, () => {
    console.log(`Server running at port: ${env.PORT}`);
  });
} catch (error) {
  console.error("Error during Data Source initialization", error);
  process.exit(1);
}
