import { DataSource } from "typeorm";
import { env } from "./dotenv.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: "postgres",
  synchronize: true,
  dropSchema: false,
  logging: true,
  entities: ["src/entities/**/*.ts"],
  subscribers: [],
  migrations: [],
});
