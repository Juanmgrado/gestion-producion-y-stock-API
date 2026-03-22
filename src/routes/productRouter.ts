import { Router } from "express";
import {
  createProductController,
  deletProductController,
  findeProductController,
  getPtoductsController,
} from "../controllers/productController.js";

const productRouter = Router();

productRouter.get("/get-products", getPtoductsController);
productRouter.get("/find-product", findeProductController);
productRouter.post("/create-product", createProductController);
productRouter.post("/delete-product", deletProductController);


export default productRouter;
