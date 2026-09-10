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
import { verifyAdmin } from "../middlewares/verifyIsAdmin.middleware.js";

const productRouter = Router();

productRouter.get("/", getProductsController);
productRouter.get("/:uuid", findProductByIdController);
productRouter.post(
  "/",
  verifyAdmin,
  validateDto(CreateProductDto),
  createProductController,
);
productRouter.patch(
  "/:uuid",
  verifyAdmin,
  validateDto(UpdateProductDto),
  updateProductController,
);
productRouter.delete("/:uuid", verifyAdmin, deleteProductController);

export default productRouter;
