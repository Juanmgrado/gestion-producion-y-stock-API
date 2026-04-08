import { Router } from "express";
import { adjustStockController } from "../controllers/adjustmentStockController.js";

const adjustmentStockRouter = Router();

adjustmentStockRouter.post(
  "/stock-adjustments/:productId",
  adjustStockController,
);

export default adjustmentStockRouter;
