import { Request } from "express";
import { RegisterAjustmentStockDto } from "../dto/adjustment/registerAjustmentStock.dto.js";
import { RegisterNewMovementDto } from "../dto/movement/registerNewMovement.dto.js";
import { CreateProductDto } from "../dto/product/createProduct.dto.js";
import { ProductUuid } from "./commons.js";
import { JwtPayload } from "./types.js";

export interface CreateNewProductRequest extends Request {
  body: CreateProductDto;
  user?: JwtPayload;
}

export interface RegisterNewMovementRequest extends Request {
  params: {
    productUuid: ProductUuid;
  };
  body: RegisterNewMovementDto;
  user?: JwtPayload;
}

export interface RegisterAjustmentStockRequest extends Request {
  params: {
    productUuid: ProductUuid;
  };
  body: RegisterAjustmentStockDto;
  user?: JwtPayload;
}
