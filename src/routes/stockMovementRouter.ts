import { Router } from "express";
import {
  getMovementsController,
  registerMovementController,
} from "../controllers/stockMovementController.js";

const stockMovement = Router();

stockMovement.get("/", getMovementsController);
stockMovement.post("/registerMovement", registerMovementController);

export default stockMovement;
