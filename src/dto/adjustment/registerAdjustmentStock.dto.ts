import { IsNumber, IsOptional, IsString, Min } from "class-validator";
import { MIN_ADJUSTMENT_STOCK } from "../../utills/consts.js";

export class RegisterAdjustmentStockDto {
  @IsNumber()
  @Min(MIN_ADJUSTMENT_STOCK)
  newStock!: number;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
