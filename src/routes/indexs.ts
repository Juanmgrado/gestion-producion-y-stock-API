import { Router } from "express";
import userrouter from "./userRouter.js";
import productRouter from "./productRouter.js";
import stockMovementRouter from "./stockMovementRouter.js";

const router = Router();

router.use("/user", userrouter);
router.use("/product", productRouter);
router.use("/movements", stockMovementRouter)
export default router;
