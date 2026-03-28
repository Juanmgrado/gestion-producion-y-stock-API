import { Request, Response } from "express";
import {
  getMovements,
  modifyMovement,
  registerMovement,
} from "../services/stockMovementService.js";

export const getMovementsController = async (req: Request, res: Response) => {
  try {
    const allMovements = await getMovements();
    return res.status(200).json(allMovements);
  } catch (error) {
    return res.status(400).json();
  }
};

export const modifyMovementController = async (req: Request, res: Response) => {
  try {
    const movementId: any = req.params.id;
    const { userId, quantity, typeMov, productId } = req.body;

    const newMovement = await modifyMovement(userId, productId, movementId, {
      quantity,
      typeMov,
      productId,
    });
    return res.status(201).json(newMovement);
  } catch (error: any) {
    if (error.message === "Product not found") {
      return res.status(404).json({ message: "Product not found" });
    }
    if (error.message === "Movement not found") {
      return res.status(404).json({ message: "Movement not found" });
    }
    if (error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }
    if (error.message === "Incorrect type movement") {
      return res.status(404).json({ message: "Incorrect type movement" });
    }
    if (error.message === "Not enought stock") {
      return res.status(404).json({ message: "Not enought stock" });
    }
    return res.status(400).json(error);
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
