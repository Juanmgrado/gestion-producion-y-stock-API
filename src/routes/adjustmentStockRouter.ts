import { Router } from "express";
import {
  getAdjustmentByUuidController,
  getAdjustmentStockController,
  newAdjustmentStockController,
} from "../controllers/adjustmentStockController.js";
import { validateDto } from "../middelwares/validateDto.middleware.js";
import { RegisterAjustmentStockDto } from "../dto/adjustment/registerAjustmentStock.dto.js";

const adjustmentStockRouter = Router();

adjustmentStockRouter.post(
  "/stock-adjustments/:productUuid",
  validateDto(RegisterAjustmentStockDto),
  newAdjustmentStockController,
);

adjustmentStockRouter.get("/", getAdjustmentStockController);
adjustmentStockRouter.get("/:adjustmentUuid", getAdjustmentByUuidController);

export default adjustmentStockRouter;
