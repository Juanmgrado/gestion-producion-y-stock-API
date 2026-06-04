import { DataSource } from "typeorm";
import { env } from "./dotenv.js";
import { User } from "../entities/user.entity.js";
import { Product } from "../entities/product.entity.js";
import { StockMovement } from "../entities/stockMovement.entity.js";
import { StockAdjustment } from "../entities/adjustmentStock.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: "postgres",
  synchronize: false,
  dropSchema: false,
  logging: true,
  entities: [User, Product, StockMovement, StockAdjustment],
  subscribers: [],
  migrations: ["src/migrations/**/*.ts"],
});
