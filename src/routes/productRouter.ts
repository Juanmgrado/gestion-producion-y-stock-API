import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  findProductByIdController,
  getProductsController,
} from "../controllers/productController.js";
import { validateDto } from "../middelwares/validateDto.middleware.js";
import { CreateProductDto } from "../dto/product/createProduct.dto.js";

const productRouter = Router();

productRouter.get("/get-products", getProductsController);
productRouter.get("/get-productById/:id", findProductByIdController);
productRouter.post(
  "/create-product",
  validateDto(CreateProductDto),
  createProductController,
);
productRouter.post("/delete-product", deleteProductController);

export default productRouter;
