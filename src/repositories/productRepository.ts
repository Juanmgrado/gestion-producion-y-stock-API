import { AppDataSource } from "../config/dataSource.js";
import { Product } from "../entities/product.entity.js";

export const productRepository = AppDataSource.getRepository(Product)