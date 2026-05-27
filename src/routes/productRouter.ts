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

productRouter.get("/get-products", getPtoductsController);
productRouter.get("/get-productById/:id", findProductByIdController);
productRouter.post(
  "/create-product",
  validateDto(CreateProductDto),
  createProductController,
);
productRouter.post("/delete-product", deletProductController);

export default productRouter;
