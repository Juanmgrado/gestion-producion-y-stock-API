import { DataSource } from "typeorm";
import { env } from "./dotenv.js";
import { User } from "../entities/user.entity.js";
import { Product } from "../entities/product.entity.js";
import { StockMovement } from "../entities/stockMovement.entity.js";
import { StockAdjustment } from "../entities/adjustmentStock.entity.js";

const isProduction = env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  synchronize: false,
  dropSchema: false,
  logging: false,
  entities: [User, Product, StockMovement, StockAdjustment],
  subscribers: [],
  migrations: [
    isProduction ? "dist/migrations/**/*.js" : "src/migrations/**/*.ts",
  ],
});
