import { AppDataSource } from "../config/dataSource.js";
import { Product } from "../entities/product.entity.js";
import {
  MovementType,
  StockMovement,
} from "../entities/stockMovement.entity.js";
import { stockMovementRepository } from "../repositories/stockMovementRepository.js";
import { checkAndModifyStock } from "../utills/checkAndModifyStock.js";
import { getProductById } from "./productService.js";
import { getuserById } from "./userService.js";

export const getMovements = async () => {
  const allMovements = await stockMovementRepository.find({
    relations: ["employee"],
    select: {
      id: true,
      quantity: true,
      note: true,
      movement: true,
      createdAt: true,
      employee: {
        name: true,
      },
    },
  });

  if (allMovements.length === 0) {
    return "No movements registered";
  }

  return { allMovements, num: allMovements.length };
};

export const getStockMovementById = async (movementId: any, manager?: any) => {
  const repo = manager
    ? manager.getRepository(StockMovement)
    : stockMovementRepository;

  const foundMovement = await repo.findOneBy({ id: movementId });
  if (!foundMovement) {
    throw new Error("Movement not found");
  }

  return foundMovement;
};

interface MovementData {
  quantity: number;
  typeMov: MovementType;
  productId: string;
}

export const modifyMovement = async (
  userId: string,
  productId: any,
  movementId: string,
  { quantity, typeMov }: MovementData,
) => {
  if (!movementId) throw new Error("movementId is required");
  if (quantity <= 0) throw new Error("Quantity must be greater than 0");
  if (!typeMov) throw new Error("typeMov is required");

  const normalizedType = typeMov
    .toString()
    .toUpperCase()
    .trim() as MovementType;

  if (!Object.values(MovementType).includes(normalizedType)) {
    throw new Error(
      `Invalid movement type: ${typeMov}. Valid values: ${Object.values(MovementType).join(", ")}`,
    );
  }

  return await AppDataSource.transaction(async (manager) => {
    const movementRepository = manager.getRepository(StockMovement);
    const productRepository = manager.getRepository(Product);

    const foundMovement = await movementRepository.findOne({
      where: { id: movementId },
    });

    if (!foundMovement) {
      throw new Error(`Movement not found with id: ${movementId}`);
    }

    const product = await productRepository.findOne({
      where: { id: foundMovement.product.id },
      lock: { mode: "pessimistic_write" },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const oldType = foundMovement.movement;
    const oldQuantity = foundMovement.quantity;

    let currentStock = product.stock;

    if (oldType === MovementType.IN) {
      currentStock -= oldQuantity;
    } else if (oldType === MovementType.OUT) {
      currentStock += oldQuantity;
    }

    if (normalizedType === MovementType.OUT) {
      if (currentStock < quantity) {
        throw new Error(
          `Not enough stock. Available: ${currentStock}, Requested: ${quantity}`,
        );
      }
      product.stock = currentStock - quantity;
    } else if (normalizedType === MovementType.IN) {
      product.stock = currentStock + quantity;
    }

    if (product.stock < 0) {
      throw new Error(
        `Operation would result in negative stock (${product.stock})`,
      );
    }

    foundMovement.quantity = quantity;
    foundMovement.movement = normalizedType; 
    foundMovement.employee = await getuserById(userId, manager);

    await movementRepository.save(foundMovement);
    await productRepository.save(product);

    return {
      message: "Movement modified successfully",
      movement: foundMovement,
    };
  });
};

export const registerMovement = async (movementdata: any, userId: string) => {
  const { productId, quantity, typeMovement, note } = movementdata;

  return await AppDataSource.transaction(async (manager) => {
    const movementRepository = manager.getRepository(StockMovement);
    const productRepository = manager.getRepository(Product);

    const foundProduct = await productRepository.findOne({
      where: { id: productId },
      lock: { mode: "pessimistic_write" },
    });
    if (!foundProduct) {
      throw new Error("Product not found");
    }

    const foundUser = await getuserById(userId, manager);

    const newStock = checkAndModifyStock(typeMovement, quantity, foundProduct.stock)
    
    foundProduct.stock = newStock

    const newMovement = movementRepository.create({
      quantity,
      movement: typeMovement,
      note,
      employee: foundUser,
      product: foundProduct,
    });

    await manager.save(foundProduct);
    await manager.save(newMovement);

    return newMovement;
  });
};
