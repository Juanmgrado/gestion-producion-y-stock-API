import { AppDataSource } from "../config/dataSource.js";
import { StockAdjustment } from "../entities/adjustmentStock.entity.js";

export const adjustmentStocklRepository = AppDataSource.getMongoRepository(StockAdjustment)