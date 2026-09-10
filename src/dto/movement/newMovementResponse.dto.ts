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

export type MovementListItem = {
  uuid: string;
  quantity: number;
  typeMovement: MovementType;
  note: string;
  createdAt: Date;
  product: { uuid: string; name: string };
  user: { name: string } | null;
};
