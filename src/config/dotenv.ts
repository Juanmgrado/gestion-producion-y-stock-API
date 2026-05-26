import dotenv from "dotenv";
import { DB_HOST, DB_USERNAME, HOST, LOCALHOST } from "../utills/conts.js";

dotenv.config();

export const env = {
  PORT: process.env.PORT ?? HOST,
  DB_HOST: process.env.DB_HOST ?? LOCALHOST,
  DB_PORT: process.env.DB_PORT ?? DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME ?? DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  JWT_SECRET: process.env.JWT_SECRET,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
};
