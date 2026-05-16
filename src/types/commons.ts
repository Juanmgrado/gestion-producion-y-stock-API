export type Uuid = string;
export type UserUuid = Uuid;
export type ProductUuid = Uuid;

export type PaginatedResponse<T> = {
  success: boolean;
  message: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: T[];
};

export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
}

