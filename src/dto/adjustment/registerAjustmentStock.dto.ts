import { IsNumber, isString, IsString, Min } from "class-validator";
import { MIN_ADJUSTMENT_STOCK } from "../../utills/conts.js";

export class RegisterAjustmentStockDto {
  @IsNumber()
  @Min(MIN_ADJUSTMENT_STOCK)
  newStock!: number;

  @IsString()
  reason?: string;

  @IsString()
  note?: string;
}
