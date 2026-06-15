import dotenv from "dotenv";
import {
  DB_HOST,
  DB_USERNAME,
  HOST,
  LOCALHOST,
  DB_NAME,
} from "../utills/conts.js";

dotenv.config();

const REQUIRED_ENV_VARS = [
  "DB_PASSWORD",
  "JWT_SECRET",
  "ADMIN_PASSWORD",
] as const;

const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingVars.join(", ")}.\n` +
      "Check your .env file (see .env.example for reference).",
  );
  process.exit(1);
}

export const env = {
  PORT: process.env.PORT ?? HOST,
  DB_HOST: process.env.DB_HOST ?? LOCALHOST,
  DB_PORT: process.env.DB_PORT ?? DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME ?? DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_DATABASE: process.env.DB_DATABASE ?? DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET!,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
};
