import { Response, Request } from "express";
import {
  createProduct,
  deletProduct,
  getProductById,
  getProducts,
} from "../services/productService.js";
import {
} from "../types/interfaces.js";
import { GetProductFiltersDto } from "../dto/product/getProductFilters.dto.js";
import { DEFAULT_PAGE, LIMIT_PAGE } from "../utills/conts.js";
import { CreateNewProductRequest } from "../types/requests.js";

export const getPtoductsController = async (
  req: Request,
  res: Response,
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
    console.error(error);
    return res.status(400).json(error);
  }
};

export const createProductController = async (
  req: CreateNewProductRequest,
  res: Response,
) => {
  try {
    const newProductData = req.body;
    const { uuid: userUuid } =
      req.user! ?? "db2ba2f6-9645-46c7-9521-d8478ed532c3";
    const createdProduct = await createProduct({ userUuid, newProductData });

    return res.status(201).json({
      createdProduct,
      message: "Product created successfully",
    });
  } catch (error: any) {
    console.error(error);

    if (error.message === "Product already exists") {
      return res.status(400).json({ message: "Product already exists" });
    }

    if (error.message === "User not found") {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const findProductByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const productId = req.params.id;

    if (!productId || typeof productId !== "string") {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const foundProduct = await getProductById(productId);
    return res.status(200).json(foundProduct);
  } catch (error: any) {
    console.error(error);

    if (error.message === "Product not found") {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
export const deletProductController = async (req: Request, res: Response) => {
  try {
    const productName = req.body.name;

    if (!productName || typeof productName !== "string") {
      return res.status(400).json({ message: "Insert a valid product name" });
    }

    const deletedProduct = await deletProduct(productName);
    return res
      .status(201)
      .json({ deletedProduct, message: "Product deleted successfully" });
  } catch (error: any) {
    console.error(error);

    if (error.message === "Product not found") {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
