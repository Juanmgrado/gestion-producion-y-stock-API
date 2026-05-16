import { MovementType } from "../../types/enums.js";

export type GetMovementsFiltersDto = {
  productUuid: string | undefined;
  userUuid: string | undefined;
  movementType: MovementType | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  minQuantity: number | undefined;
  maxQuantity: number | undefined;
  note: string | undefined;
  page: number | undefined;
  limit: number | undefined;
};
