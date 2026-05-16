import { Router } from "express";
import {
  createProductController,
  deletProductController,
  findProductByIdController,
  getPtoductsController,
} from "../controllers/productController.js";
import { validateDto } from "../middelwares/validateDto.middelware.js";
import { CreateProductDto } from "../dto/product/createProduct.dto.js";

const productRouter = Router();

productRouter.get("/get-products", getPtoductsController);
productRouter.get(
  "/get-productById/:id",
  findProductByIdController,
);
productRouter.post(
  "/create-product",
  validateDto(CreateProductDto),
  createProductController,
);
productRouter.post("/delete-product", deletProductController);

export default productRouter;
