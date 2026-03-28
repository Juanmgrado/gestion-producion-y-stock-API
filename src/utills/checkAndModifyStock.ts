import { MovementType } from "../entities/stockMovement.entity.js";

export const checkAndModifyStock = (
  typeMov: MovementType,
  quantity: number,
  stock: any,
) => {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  if (!Object.values(MovementType).includes(typeMov)) {
    throw new Error("Incorrect type movement");
  }

  if (typeMov === MovementType.OUT) {
    if (quantity > stock) {
      throw new Error("Not enough stock");
    }
    return (stock -= quantity);
  } else if (typeMov === MovementType.IN) {
    return (stock += quantity);
  }
};
