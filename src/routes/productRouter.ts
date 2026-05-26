import { Router } from "express";
import {
  createProductController,
  deletProductController,
  findProductByIdController,
  getPtoductsController,
} from "../controllers/productController.js";
import { validateDto } from "../middelwares/validateDto.middleware.js";
import { CreateProductDto } from "../dto/product/createProduct.dto.js";
import { verifyToken } from "../middelwares/verifyToken.middleware.js";
import { verifyAdmin } from "../middelwares/verifyIsAdmin.middleware.js";

const productRouter = Router();

productRouter.get("/get-products", verifyToken, getPtoductsController);
productRouter.get(
  "/get-productById/:id",
  verifyToken,
  findProductByIdController,
);
productRouter.post(
  "/create-product",
  verifyToken,
  verifyAdmin,
  validateDto(CreateProductDto),
  createProductController,
);
productRouter.post(
  "/delete-product",
  verifyToken,
  verifyAdmin,
  deletProductController,
);

export default productRouter;
