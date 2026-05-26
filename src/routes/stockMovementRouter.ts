import { Router } from "express";
import {
  getMovementsController,
  registerMovementController,
} from "../controllers/stockMovementController.js";
import { validateDto } from "../middelwares/validateDto.middleware.js";
import { RegisterNewMovementDto } from "../dto/movement/registerNewMovement.dto.js";
import { verifyToken } from "../middelwares/verifyToken.middleware.js";

const stockMovement = Router();

stockMovement.get("/", verifyToken, getMovementsController);
stockMovement.post(
  "/registerMovement/:productId",
  verifyToken,
  validateDto(RegisterNewMovementDto),
  registerMovementController,
);

export default stockMovement;
