import { AppDataSource } from "../config/dataSource.js";
import { Product } from "../entities/product.entity.js";
import {
  MovementType,
  StockMovement,
} from "../entities/stockMovement.entity.js";
import { stockMovementRepository } from "../repositories/stockMovementRepository.js";
import { stockMovementsFilters } from "../types/filters.js";
import { checkAndModifyStock } from "../utills/checkAndModifyStock.js";
import { getuserById } from "./userService.js";

interface MovementData {
  quantity: number;
  typeMov: MovementType;
  productId: string;
}

export const getMovements = async (
  stockMovementsFilters: stockMovementsFilters = {},
) => {
  const qb = stockMovementRepository
    .createQueryBuilder("movement")
    .leftJoinAndSelect("movement.employee", "employee")
    .leftJoinAndSelect("movement.product", "product");

  if (stockMovementsFilters.productId) {
    qb.andWhere("movement.productId = :productId", {
      productId: stockMovementsFilters.productId,
    });
  }

  if (stockMovementsFilters.employee) {
    qb.andWhere("movement.employee = :employee", {
      employee: stockMovementsFilters.employee,
    });
  }

  if (stockMovementsFilters.movementType) {
    qb.andWhere("movement.movement = :movementType", {
      movementType: stockMovementsFilters.movementType,
    });
  }

  if (stockMovementsFilters.startDate) {
    qb.andWhere("movement.createdAt >= :startDate", {
      startDate: stockMovementsFilters.startDate,
    });
  }

  if (stockMovementsFilters.endDate) {
    qb.andWhere("movement.createdAt <= :endDate", {
      endDate: stockMovementsFilters.endDate,
    });
  }

  if (stockMovementsFilters.minQuantity !== undefined) {
    qb.andWhere("movement.quantity >= :minQuantity", {
      minQuantity: stockMovementsFilters.minQuantity,
    });
  }

  if (stockMovementsFilters.maxQuantity !== undefined) {
    qb.andWhere("movement.quantity <= :maxQuantity", {
      maxQuantity: stockMovementsFilters.maxQuantity,
    });
  }

  if (stockMovementsFilters.note) {
    qb.andWhere("movement.note ILIKE :note", {
      note: `%${stockMovementsFilters.note}%`,
    });
  }

  qb.orderBy("movement.createdAt", "DESC");

  const movements = await qb.getMany();

  if (movements.length === 0) {
    return {
      success: true,
      message: "No movements registered",
      count: 0,
      data: [],
    };
  }

  return {
    success: true,
    message: "Movements retrieved successfully",
    count: movements.length,
    data: movements,
  };
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

    const newStock = checkAndModifyStock(
      typeMovement,
      quantity,
      foundProduct.stock,
    );

    foundProduct.stock = newStock;

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
