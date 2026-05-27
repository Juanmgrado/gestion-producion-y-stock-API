import { Router } from "express";
import userrouter from "./userRouter.js";
import productRouter from "./productRouter.js";
import stockMovementRouter from "./stockMovementRouter.js";
import adjustmentStockRouter from "./adjustmentStockRouter.js";
import authRouter from "./auth.router.js";
import { verifyToken } from "../middelwares/verifyToken.middleware.js";
import { verifyAdmin } from "../middelwares/verifyIsAdmin.middleware.js";

const router = Router();

router.use("/user", verifyToken, verifyAdmin, userrouter);
router.use("/product", verifyToken, productRouter);
router.use("/movements", verifyToken, stockMovementRouter);
router.use("/adjustment", verifyToken, adjustmentStockRouter);
router.use("/auth", authRouter);
export default router;
