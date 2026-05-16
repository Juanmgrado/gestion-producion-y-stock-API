import { IsNumber, Min, IsEnum, IsString, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { MIN_QUANTITY_IN_PRODUCT } from "../../utills/conts.js";
import { MovementType } from "../../types/enums.js";

export class RegisterNewMovementDto {
  @Type(() => Number)
  @IsNumber()
  @Min(MIN_QUANTITY_IN_PRODUCT)
  quantity!: number;

  @IsString()
  @IsOptional()
  note?: string

  @IsEnum(MovementType)
  typeMovement!: MovementType;
}