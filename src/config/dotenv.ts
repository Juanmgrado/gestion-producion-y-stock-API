import dotenv from "dotenv";
import {
  DB_HOST,
  DB_USERNAME,
  HOST,
  LOCALHOST,
  DB_NAME,
  REQUIRED_ENV_VARS,
  EMPTY_ENV_VAR,
} from "../utills/consts.js";

dotenv.config();

const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missingVars.length > EMPTY_ENV_VAR) {
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
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  JWT_SECRET: process.env.JWT_SECRET!,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM: process.env.TWILIO_WHATSAPP_FROM,
  TWILIO_WHATSAPP_TO: process.env.TWILIO_WHATSAPP_TO,
};
