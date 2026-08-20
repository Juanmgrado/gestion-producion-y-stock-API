import twilio from "twilio";
import { env } from "../config/dotenv.js";

export async function notifyLowStock(productName: string): Promise<void> {
  if (
    !env.TWILIO_ACCOUNT_SID ||
    !env.TWILIO_AUTH_TOKEN ||
    !env.TWILIO_WHATSAPP_FROM ||
    !env.TWILIO_WHATSAPP_TO
  ) {
    console.warn("Twilio is not configured, skipping low stock notification.");
    return;
  }

  try {
    const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      from: env.TWILIO_WHATSAPP_FROM,
      to: env.TWILIO_WHATSAPP_TO,
      body: `⚠️ Stock alert: product "${productName}" just ran out of stock.`,
    });
  } catch (error) {
    console.error("Failed to send WhatsApp low stock notification:", error);
  }
}
