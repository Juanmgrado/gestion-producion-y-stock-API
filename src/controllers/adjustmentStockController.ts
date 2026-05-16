import { Request, Response } from "express";
import { getAdjustmentsStock, newAdjustmentStock } from "../services/adjusmentStockService.js";
import { RegisterAjustmentStockRequest } from "../types/requests.js";
import { GetAjustmentStockFiltersDto } from "../dto/adjustment/getAjusmentStock.dto.js";

export const newAdjustmentStockController = async (
  req: RegisterAjustmentStockRequest,
  res: Response,
) => {
  try {
    const productUuid = req.params.productUuid;
    const newRegisterAjustmentStockData = req.body;
    const { uuid: userUuid } = req.user!;
    const newAdjustStock = await newAdjustmentStock({
      userUuid,
      productUuid,
      newRegisterAjustmentStockData,
    });

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

export const getAdjustmentStockController = async (
  req: Request,
  res: Response,
) => {
  try {
    const AdjustmentStockFilters: GetAjustmentStockFiltersDto = {
      productId: req.query.productId as string | undefined,
      difference: req.query.difference
        ? Number(req.query.difference)
        : undefined,
      adjustedById: req.query.adjustedById as string | undefined,
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

    const adjustmentMovementStockList = await getAdjustmentsStock(
      AdjustmentStockFilters,
    );
    res.status(200).json(adjustmentMovementStockList);
  } catch (error: any) {
    res.status(404).json();
  }
};
