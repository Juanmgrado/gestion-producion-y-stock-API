import { Router } from "express";
import {
  getMovementsController,
  registerMovementController,
} from "../controllers/stockMovementController.js";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import { RegisterNewMovementDto } from "../dto/movement/registerNewMovement.dto.js";

const stockMovement = Router();

stockMovement.get("/", getMovementsController);
stockMovement.post(
  "/:productUuid",
  validateDto(RegisterNewMovementDto),
  registerMovementController,
);

export default stockMovement;
