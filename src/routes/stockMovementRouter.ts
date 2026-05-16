import { Router } from "express";
import {
  getMovementsController,
  registerMovementController,
} from "../controllers/stockMovementController.js";
import { validateDto } from "../middelwares/validateDto.middelware.js";
import { RegisterNewMovementDto } from "../dto/movement/registerNewMovement.dto.js";

const stockMovement = Router();

stockMovement.get("/", getMovementsController);
stockMovement.post(
  "/registerMovement/:productId",
  validateDto(RegisterNewMovementDto),
  registerMovementController,
);

export default stockMovement;
