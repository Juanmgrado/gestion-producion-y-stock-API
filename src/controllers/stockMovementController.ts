import { Request, Response } from "express";
import {
  getMovements,
  registerMovement,
} from "../services/stockMovementService.js";
import { GetMovementsFiltersDto } from "../dto/movement/getMovementsFilters.dto.js";
import {} from "../types/interfaces.js";
import { RegisterNewMovementRequest } from "../types/requests.js";
import { MovementType } from "../types/enums.js";

export const getMovementsController = async (req: Request, res: Response) => {
  try {
    const getMovementsFilters: GetMovementsFiltersDto = {
      productUuid: req.query.productId as string | undefined,
      userUuid: req.query.employee as string | undefined,
      note: req.query.note as string | undefined,

      movementType: Object.values(MovementType).includes(
        req.query.movementType as MovementType,
      )
        ? (req.query.movementType as MovementType)
        : undefined,

      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,

      minQuantity: req.query.minQuantity
        ? Number(req.query.minQuantity)
        : undefined,
      maxQuantity: req.query.maxQuantity
        ? Number(req.query.maxQuantity)
        : undefined,

      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    };

    const movementsList = await getMovements(getMovementsFilters);

    return res.status(200).json(movementsList);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error al obtener los movimientos",
    });
  }
};

export const registerMovementController = async (
  req: RegisterNewMovementRequest,
  res: Response,
) => {
  try {
    const { uuid: userUuid } =
      req.user! ?? "db2ba2f6-9645-46c7-9521-d8478ed532c3";
    const productUuid = req.params.productUuid;
    const newMovementData = req.body;

    const newMovementRegistered = await registerMovement({
      userUuid,
      productUuid,
      newMovementData,
    });

    return res.status(200).json({
      newMovementRegistered,
      message: "Movement registered successfully",
    });
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
