import { Request } from "express";
import { RegisterNewMovementDto } from "../dto/movement/registerNewMovement.dto.js";
import { RegisterAjustmentStockDto } from "../dto/adjustment/registerAjustmentStock.dto.js";
import { CreateProductDto } from "../dto/product/createProduct.dto.js";
import { GetMovementsFiltersDto } from "../dto/movement/getMovementsFilters.dto.js";

export type UserUuid = {
  userUuid: string;
};

export type ProdcutUuid = {
  productUuid: string;
};

export type UserEmail = {
  email: string
}