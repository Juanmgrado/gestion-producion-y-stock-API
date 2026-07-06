import { Request } from "express";
import { RegisterAdjustmentStockDto } from "../dto/adjustment/registerAdjustmentStock.dto.js";
import { RegisterNewMovementDto } from "../dto/movement/registerNewMovement.dto.js";
import { CreateProductDto } from "../dto/product/createProduct.dto.js";
import { AdjustmentUuid, ProductUuid, UserUuid } from "./common.js";
import { JwtPayload } from "./types.js";
import { UpdateProductDto } from "../dto/product/updateProduct.dto.js";
import { UpdateUserDto } from "../dto/user/updateUser.dto.js";

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

export interface RegisterAdjustmentStockRequest extends Request {
  params: {
    productUuid: ProductUuid;
  };
  body: RegisterAdjustmentStockDto;
  user?: JwtPayload;
}

export interface GetAdjustmentStockRequest extends Request {
  params: {
    adjustmentUuid: AdjustmentUuid;
  };
}

export interface GetUserByUuidRequest extends Request {
  params: {
    uuid: UserUuid;
  };
}

export interface UpdateUserRequest extends Request {
  params: {
    uuid: UserUuid;
  };
  body: UpdateUserDto;
  user?: JwtPayload;
}


export interface GetProductByUuidRequest extends Request {
  params: {
    uuid: ProductUuid;
  };
}

export interface UpdateProductRequest extends Request {
  params: {
    uuid: ProductUuid;
  };
  body: UpdateProductDto;
}
