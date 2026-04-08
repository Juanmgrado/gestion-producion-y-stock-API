import { Response, Request } from "express";
import {
  createProduct,
  deletProduct,
  getProductById,
  getProduct,
} from "../services/productService.js";

export const getPtoductsController = async (req: Request, res: Response) => {
  try {
    const productsList = await getProduct();
    return res.status(200).json(productsList);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

export const createProductController = async (req: Request, res: Response) => {
  try {
    const newProduct: string = req.body.name;
    if (!newProduct || typeof newProduct !== "string") {
      return res.status(400).json({ message: "Invalid product name" });
    }
    const product = await createProduct(newProduct);
    return res
      .status(201)
      .json({ product, message: "Product created successfully" });
  } catch (error: any) {
    console.error(error);

    if (error.message === "Product already exists") {
      return res.status(400).json({ message: "Product already exists" });
    }

    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const findProductByIdController = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    if (!productId || typeof productId !== "string") {
      return res.status(400).json({ message: "Insert a valid product name" });
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
