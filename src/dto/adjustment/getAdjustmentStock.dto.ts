
export type GetAdjustmentStockFiltersDto = {
  productUuid: string | undefined;
  adjustedByUuid: string | undefined;
  difference: number | undefined;
  expectedStock: number | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  minQuantity: number | undefined;
  maxQuantity: number | undefined;
  note: string | undefined;
  page: number | undefined;
  limit: number | undefined;
};

	