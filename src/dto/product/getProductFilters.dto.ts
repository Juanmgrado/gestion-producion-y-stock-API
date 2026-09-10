import { Order, ProductSortBy } from "../../types/enums.js";

export type GetProductFiltersDto = {
  name: string | undefined;
  isActive: boolean | undefined;
  minStock: number | undefined;
  maxStock: number | undefined;
  createdBy: string | undefined;
  page: number | 1;
  limit: number | 10;
  sortBy: ProductSortBy | undefined;
  order: Order | undefined;
};
