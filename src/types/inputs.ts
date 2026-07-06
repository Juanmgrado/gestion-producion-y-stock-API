import { RegisterAdjustmentStockDto } from "../dto/adjustment/registerAdjustmentStock.dto.js";
import { RegisterNewMovementDto } from "../dto/movement/registerNewMovement.dto.js";
import { CreateProductDto } from "../dto/product/createProduct.dto.js";
import { UpdateProductDto } from "../dto/product/updateProduct.dto.js";
import { ChangePasswordDto } from "../dto/user/changePassword.dto.js";

export interface RegisterNewMovementInput {
  userUuid: string;
  productUuid: string;
  newMovementData: RegisterNewMovementDto;
}

export interface RegisterAdjustmentStockInput {
  userUuid: string;
  productUuid: string;
  newRegisterAdjustmentStockData: RegisterAdjustmentStockDto;
}

export interface CreateNewProductInput {
  userUuid: string;
  newProductData: CreateProductDto;
}

export interface ChangeUserPasswordInput {
  email: string;
  changePasswordData: ChangePasswordDto;
}

export interface UpdateProductInput {
  uuid: string;
  updateProductData: UpdateProductDto;
}
