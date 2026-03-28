import { Router } from "express";
import {
  getMovementsController,
  modifyMovementController,
  registerMovementController,
} from "../controllers/stockMovementController.js";

const stockMovement = Router();

stockMovement.get("/", getMovementsController);
stockMovement.post("/registerMovement", registerMovementController);
stockMovement.post("/modify-mov/:id", modifyMovementController)

export default stockMovement;
