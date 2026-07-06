import { IsString, MaxLength, MinLength } from "class-validator";
import { MAX_PRODUCTNAME, MIN_PRODUCTNAME } from "../../utills/consts.js";

export class UpdateProductDto {
  @IsString()
  @MinLength(MIN_PRODUCTNAME)
  @MaxLength(MAX_PRODUCTNAME)
  name!: string;
}
