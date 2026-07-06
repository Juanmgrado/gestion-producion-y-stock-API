import { AppError } from "../middlewares/errorHandler.middleware.js";

export function checkAndModifyStock(
  type: "IN" | "OUT",
  quantity: number,
  currentStock: number,
): number {
  if (quantity <= 0) {
    throw new AppError("Quantity must be greater than 0", 400);
  }

  if (type === "IN") {
    return currentStock + quantity;
  }

  if (type === "OUT") {
    if (currentStock < quantity) {
      throw new AppError("Not enough stock", 400);
    }
    return currentStock - quantity;
  }

  throw new AppError("Invalid movement type", 400);
}
