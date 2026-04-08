import { Request, Response } from "express";
import { adjustStockService } from "../services/adjusmentStockService.js";

export const adjustStockController = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { newStock, reason, note } = req.body;
    const userId = req.body.userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const newAdjustStock = await adjustStockService(
      userId,
      productId,
      newStock,
      reason,
      note,
    );

    return res.status(201).json({
      message: "Adjustment registered successfully",
      data: newAdjustStock,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      message: error.message || "Error al ajustar stock",
    });
  }
};