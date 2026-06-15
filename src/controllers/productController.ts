import { NextFunction, Response, Request } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
} from "../services/productService.js";
import { GetProductFiltersDto } from "../dto/product/getProductFilters.dto.js";
import { DEFAULT_PAGE, LIMIT_PAGE } from "../utills/conts.js";
import { CreateNewProductRequest } from "../types/requests.js";

export const getProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const filtersProduct: GetProductFiltersDto = {
      name: req.query.name as string | undefined,
      isActive:
        req.query.isActive === "true"
          ? true
          : req.query.isActive === "false"
            ? false
            : undefined,
      minStock: req.query.minStock ? Number(req.query.minStock) : undefined,
      maxStock: req.query.maxStock ? Number(req.query.maxStock) : undefined,
      createdBy: req.query.createdBy as string | undefined,
      page: req.query.page ? Number(req.query.page) : DEFAULT_PAGE,
      limit: req.query.limit ? Number(req.query.limit) : LIMIT_PAGE,
      sortBy: req.query.sortBy as string | undefined,
    };

    const productsList = await getProducts(filtersProduct);
    return res.status(200).json(productsList);
  } catch (error) {
    next(error);
  }
};

export const createProductController = async (
  req: CreateNewProductRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newProductData = req.body;
    const { email: userEmail } = req.user!;
    const createdProduct = await createProduct({ userEmail, newProductData });

    return res.status(201).json({
      createdProduct,
      message: "Product created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const findProductByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = req.params.id;

    if (!productId || typeof productId !== "string") {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const foundProduct = await getProductById(productId);
    return res.status(200).json(foundProduct);
  } catch (error) {
    next(error);
  }
};
export const deleteProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productName = req.body.name;

    if (!productName || typeof productName !== "string") {
      return res.status(400).json({ message: "Insert a valid product name" });
    }

    const deletedProduct = await deleteProduct(productName);
    return res
      .status(204)
      .json({ deletedProduct, message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
