import { Request, Response } from "express";
import {
  getMovements,
  registerMovement,
} from "../services/stockMovementService.js";
import { stockMovementsFilters } from "../types/filters.js";

export const getMovementsController = async (req: Request, res: Response) => {
  try {
    const filters: stockMovementsFilters = {
      ...(req.query.productId && { productId: req.query.productId as string }),
      ...(req.query.employee && { employee: req.query.employee as string }),
      ...(req.query.movementType && {
        movementType: req.query.movementType as "IN" | "OUT",
      }),
      ...(req.query.startDate && { startDate: req.query.startDate as string }),
      ...(req.query.endDate && { endDate: req.query.endDate as string }),
      ...(req.query.minQuantity && {
        minQuantity: Number(req.query.minQuantity),
      }),
      ...(req.query.maxQuantity && {
        maxQuantity: Number(req.query.maxQuantity),
      }),
      ...(req.query.note && { note: req.query.note as string }),
    };

    const result = await getMovements(filters);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error al obtener los movimientos",
    });
  }
};

export const registerMovementController = async (
  req: Request,
  res: Response,
) => {
  try {
    const movementdata = req.body;
    const { userId } = req.body;

    const newMovement = await registerMovement(movementdata, userId);
    return res
      .status(200)
      .json({ newMovement, message: "Movement registered successfully" });
  } catch (error: any) {
    console.error(error);
    if (error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }
    if (error.message === "Quantity must be greater than 0") {
      return res
        .status(404)
        .json({ message: "Quantity must be greater than 0" });
    }
    if (error.message === "Product not found") {
      return res.status(404).json({ message: "Product not found" });
    }
    if (error.message === "Not enough stock") {
      return res.status(400).json({ message: "Not enough stock" });
    }
    if (error.message === "Incorrect type movement") {
      return res.status(404).json({ message: "Incorrect type movement" });
    }
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
