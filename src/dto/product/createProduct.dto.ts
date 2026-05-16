import { IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";
import { MAX_PRODUCTNAME, MIN_PRODUCTNAME, MIN_QUANTITY_IN_PRODUCT } from "../../utills/conts.js";
import { Type } from "class-transformer";

export class CreateProductDto {
  @IsString()
  @MinLength(MIN_PRODUCTNAME)
  @MaxLength(MAX_PRODUCTNAME)
  name!: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(MIN_QUANTITY_IN_PRODUCT)
  stock?: number;
}
