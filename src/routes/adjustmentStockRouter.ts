import { Router } from "express";
import {
  getAdjustmentStockController,
  newAdjustmentStockController,
} from "../controllers/adjustmentStockController.js";
import { validateDto } from "../middelwares/validateDto.middleware.js";
import { RegisterAjustmentStockDto } from "../dto/adjustment/registerAjustmentStock.dto.js";
import { verifyToken } from "../middelwares/verifyToken.middleware.js";
import { verifyAdmin } from "../middelwares/verifyIsAdmin.middleware.js";

const adjustmentStockRouter = Router();

adjustmentStockRouter.post(
  "/stock-adjustments/:productId",
  validateDto(RegisterAjustmentStockDto),
  newAdjustmentStockController,
);

adjustmentStockRouter.get(
  "/",
  getAdjustmentStockController,
);

export default adjustmentStockRouter;
