export type AdjustmentResponseDto = {
  uuid: string;
  productId: string;
  adjustedById: string;
  expectedStock: number;
  actualStock: number;
  difference: number;
  createdAt: string;
};
