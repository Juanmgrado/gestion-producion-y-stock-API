import { Router } from "express";
import userrouter from "./userRouter.js";
import productRouter from "./productRouter.js";
import stockMovementRouter from "./stockMovementRouter.js";
import adjustmentStockRouter from "./adjustmentStockRouter.js";

const router = Router();

router.use("/user", userrouter);
router.use("/product", productRouter);
router.use("/movements", stockMovementRouter)
router.use("/adjustment", adjustmentStockRouter);
export default router;
