import { Router } from "express";
import {
  getAdjustmentByUuidController,
  getAdjustmentStockController,
  newAdjustmentStockController,
} from "../controllers/adjustmentStockController.js";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import { RegisterAdjustmentStockDto } from "../dto/adjustment/registerAdjustmentStock.dto.js";

const adjustmentStockRouter = Router();

adjustmentStockRouter.get("/", getAdjustmentStockController);
adjustmentStockRouter.get("/:adjustmentUuid", getAdjustmentByUuidController);
adjustmentStockRouter.post(
  "/:productUuid",
  validateDto(RegisterAdjustmentStockDto),
  newAdjustmentStockController,
);

export default adjustmentStockRouter;
