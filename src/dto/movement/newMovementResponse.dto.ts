import { ProductUuid } from "../../types/common.js";
import { MovementType } from "../../types/enums.js";

export type MovementResponse = {
  uuid: string;
  quantity: number;
  note: string;
  typeMovement: MovementType;
  productUuid: ProductUuid;
  createdAt: Date;
};