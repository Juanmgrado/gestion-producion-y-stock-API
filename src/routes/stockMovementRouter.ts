import { Router } from "express";
import {
  getMovementsController,
  registerMovementController,
} from "../controllers/stockMovementController.js";
import { validateDto } from "../middelwares/validateDto.middleware.js";
import { RegisterNewMovementDto } from "../dto/movement/registerNewMovement.dto.js";

const stockMovement = Router();

stockMovement.get("/", getMovementsController);
stockMovement.post(
  "/registerMovement/:productUuid",
  validateDto(RegisterNewMovementDto),
  registerMovementController,
);

export default stockMovement;
