import { Router } from "express";
import userrouter from "./userRouter.js";

const router = Router();

router.use("/users", userrouter);

export default router;
