import { Order, UserSortBy } from "../../types/enums.js";


export type GetUserFiltersDto = {
  name: string | undefined;
  email: string | undefined;
  isAdmin: boolean | undefined;
  isActive: boolean | undefined;
  sortBy: UserSortBy | undefined;
  order: Order | undefined;
  page: number | 1;
  limit: number | 10;
};
