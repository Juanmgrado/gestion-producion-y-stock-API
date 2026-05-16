

export function checkAndModifyStock(
  type: "IN" | "OUT",
  quantity: number,
  currentStock: number,
): number {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  if (type === "IN") {
    return currentStock + quantity;
  }

  if (type === "OUT") {
    if (currentStock < quantity) {
      throw new Error("Not enough stock");
    }
    return currentStock - quantity;
  }

  throw new Error("Invalid movement type");
}