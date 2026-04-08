import { AppDataSource } from "../config/dataSource.js";
import { StockAdjustment } from "../entities/adjustmentStock.entity.js";
import { Product } from "../entities/product.entity.js";
import { getuserById } from "./userService.js";

export const adjustStockService = async (
  userId: string,
  productId: string,
  newStock: number,
  reason?: string,
  note?: string,
) => {
  return await AppDataSource.transaction(async (manager) => {
    const productRepository = manager.getRepository(Product);
    const adjustmentRepository = manager.getRepository(StockAdjustment);

    const foundUser = await getuserById(userId, manager);

    const foundProduct = await productRepository.findOne({
      where: { id: productId },
      lock: { mode: "pessimistic_write" },
    });

    if (!foundProduct) {
      throw new Error("Product not found");
    }

   const newAdjustment = adjustmentRepository.create({
     productId: foundProduct.id,
     expectedStock: foundProduct.stock,
     actualStock: newStock,
     difference: newStock - foundProduct.stock,
     reason: reason || "Ajuste manual",
     adjustedById: userId,
   });

   foundProduct.stock = newStock
   
   if (note) {
     newAdjustment.notes = note;
   }
    await productRepository.save(foundProduct);
    await adjustmentRepository.save(newAdjustment);

    return newAdjustment;
  });
};