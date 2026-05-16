import { RegisterAjustmentStockDto } from "../dto/adjustment/registerAjustmentStock.dto.js";
import { RegisterNewMovementDto } from "../dto/movement/registerNewMovement.dto.js";
import { CreateProductDto } from "../dto/product/createProduct.dto.js";

export interface RegisterNewMovementInput {
  userUuid: string;
  productUuid: string;
  newMovementData: RegisterNewMovementDto;
}

export interface RegisterAjustmentStockInput {
  userUuid: string;
  productUuid: string;
  newRegisterAjustmentStockData: RegisterAjustmentStockDto;
}

export interface CreateNewProductInput {
  userUuid: string;
  newProductData: CreateProductDto;
}
