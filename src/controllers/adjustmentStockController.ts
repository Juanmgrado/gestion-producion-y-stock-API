import { NextFunction, Request, Response } from "express";
import {
  getAdjustmentByUuid,
  getAdjustmentsStock,
  newAdjustmentStock,
} from "../services/adjustmentStockService.js";
import { GetAdjustmentStockRequest, RegisterAdjustmentStockRequest } from "../types/requests.js";
import { GetAdjustmentStockFiltersDto } from "../dto/adjustment/getAdjustmentStock.dto.js";

export const newAdjustmentStockController = async (
  req: RegisterAdjustmentStockRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productUuid = req.params.productUuid;
    const newRegisterAdjustmentStockData = req.body;
    const { uuid: userUuid } = req.user!;
    const result = await newAdjustmentStock({
      userUuid,
      productUuid,
      newRegisterAdjustmentStockData,
    });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAdjustmentStockController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const AdjustmentStockFilters: GetAdjustmentStockFiltersDto = {
      productUuid: req.query.productUuid as string | undefined,
      difference: req.query.difference
        ? Number(req.query.difference)
        : undefined,
      adjustedByUuid: req.query.adjustedByUuid as string | undefined,
      expectedStock: req.query.expectedStock
        ? Number(req.query.expectedStock)
        : undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      minQuantity: req.query.minQuantity
        ? Number(req.query.minQuantity)
        : undefined,
      maxQuantity: req.query.maxQuantity
        ? Number(req.query.maxQuantity)
        : undefined,
      note: req.query.note as string | undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    };

    const result = await getAdjustmentsStock(
      AdjustmentStockFilters,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAdjustmentByUuidController = async (
  req: GetAdjustmentStockRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { adjustmentUuid } = req.params;
    const result = await getAdjustmentByUuid(adjustmentUuid);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
