import { NextFunction, Request, Response } from "express";
import {
  getMovements,
  registerMovement,
} from "../services/stockMovementService.js";
import { GetMovementsFiltersDto } from "../dto/movement/getMovementsFilters.dto.js";
import { RegisterNewMovementRequest } from "../types/requests.js";
import { MovementType } from "../types/enums.js";

export const getMovementsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getMovementsFilters: GetMovementsFiltersDto = {
      productUuid: req.query.productUuid as string | undefined,
      userUuid: req.query.userUuid as string | undefined,
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
  } catch (error) {
    next(error);
  }
};

export const registerMovementController = async (
  req: RegisterNewMovementRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { uuid: userUuid } = req.user!;
    const productUuid = req.params.productUuid;
    const newMovementData = req.body;

    const result = await registerMovement({
      userUuid,
      productUuid,
      newMovementData,
    });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
