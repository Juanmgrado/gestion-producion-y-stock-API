export interface stockMovementsFilters {
  productId?: string;
  employee?: string;
  movementType?: "IN" | "OUT";
  startDate?: string;
  endDate?: string;
  minQuantity?: number;
  maxQuantity?: number;
  note?: string;
}

export interface productFilter {
  name?: string;
  minStock?: number;
  maxStock?: number;
  createdBy?: string;
  sortBy?: "name" | "stock" | "isActive" | "createdAt";
  order?: "ASC" | "DESC";
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface UserFilters {
  name?: string;
  email?: string;
  code?: number;
  isAdmin?: boolean;
  isActive?: boolean;
  sortBy?: "name" | "email" | "code";
  order?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}
