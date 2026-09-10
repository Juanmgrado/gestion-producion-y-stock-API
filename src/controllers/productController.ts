import { NextFunction, Response, Request } from "express";
import {
  createProduct,
  deleteProduct,
  findProductByUuid,
  getProducts,
  updateProduct,
} from "../services/productService.js";
import { GetProductFiltersDto } from "../dto/product/getProductFilters.dto.js";
import { DEFAULT_PAGE, LIMIT_PAGE } from "../utills/consts.js";
import { Order, ProductSortBy } from "../types/enums.js";
import {
  CreateNewProductRequest,
  GetProductByUuidRequest,
  UpdateProductRequest,
} from "../types/requests.js";

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
      sortBy: Object.values(ProductSortBy).includes(
        req.query.sortBy as ProductSortBy,
      )
        ? (req.query.sortBy as ProductSortBy)
        : undefined,
      order: Object.values(Order).includes(req.query.order as Order)
        ? (req.query.order as Order)
        : undefined,
    };

    const productsList = await getProducts(filtersProduct, req.user!.isAdmin);
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
    const { uuid: userUuid } = req.user!;
    const result = await createProduct({ userUuid, newProductData });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const findProductByIdController = async (
  req: GetProductByUuidRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productUuid = req.params.uuid;

    const result = await findProductByUuid(productUuid);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
export const deleteProductController = async (
  req: GetProductByUuidRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productUuid = req.params.uuid;

    const result = await deleteProduct(productUuid);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateProductController = async (
  req: UpdateProductRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const uuid = req.params.uuid;
    const updateProductData = req.body;

    const updatedProduct = await updateProduct({ uuid, updateProductData });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};
