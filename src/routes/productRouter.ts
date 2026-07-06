import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  findProductByIdController,
  getProductsController,
  updateProductController,
} from "../controllers/productController.js";
import { validateDto } from "../middlewares/validateDto.middleware.js";
import { CreateProductDto } from "../dto/product/createProduct.dto.js";
import { UpdateProductDto } from "../dto/product/updateProduct.dto.js";

const productRouter = Router();

productRouter.get("/", getProductsController);
productRouter.get("/:uuid", findProductByIdController);
productRouter.post("/", validateDto(CreateProductDto), createProductController);
productRouter.patch(
  "/:uuid",
  validateDto(UpdateProductDto),
  updateProductController,
);
productRouter.delete("/:uuid", deleteProductController);

export default productRouter;
