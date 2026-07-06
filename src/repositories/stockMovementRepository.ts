import { AppDataSource } from "../config/dataSource.js";
import { StockMovement } from "../entities/stockMovement.entity.js";

export const stockMovementRepository = AppDataSource.getRepository(StockMovement)