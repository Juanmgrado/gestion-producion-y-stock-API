export type AdjustmentResponseDto = {
  uuid: string;
  productUuid: string;
  adjustedByUuid: string;
  expectedStock: number;
  actualStock: number;
  difference: number;
  createdAt: string;
};
