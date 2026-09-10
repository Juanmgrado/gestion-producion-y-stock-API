export type ProductResponseDto = {
  uuid: string;
  name: string;
  stock: number;
  isActive: boolean;
  createdBy?: {
    uuid: string;
    name: string;
  };
};
