import { Router } from "express";
import {
  createProductController,
  deletProductController,
  findProductByIdController,
  getPtoductsController,
} from "../controllers/productController.js";

const productRouter = Router();

productRouter.get("/get-products", getPtoductsController);
productRouter.get("/get-product/:id", findProductByIdController);
productRouter.post("/create-product", createProductController);
productRouter.post("/delete-product", deletProductController);


export default productRouter;
