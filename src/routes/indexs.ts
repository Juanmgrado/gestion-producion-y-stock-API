import { Router } from "express";
import userrouter from "./userRouter.js";
import productRouter from "./productRouter.js";

const router = Router();

router.use("/user", userrouter);
router.use("/product", productRouter);
export default router;
