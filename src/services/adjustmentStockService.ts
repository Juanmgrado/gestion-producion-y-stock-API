import { AppDataSource } from "../config/dataSource.js";
import { AdjustmentResponseDto } from "../dto/adjustment/adjustmentResponse.dto.js";
import { GetAjustmentStockFiltersDto } from "../dto/adjustment/getAjusmentStock.dto.js";
import { StockAdjustment } from "../entities/adjustmentStock.entity.js";
import { Product } from "../entities/product.entity.js";
import { AppError } from "../middelwares/errorsHandler.js";
import { adjustmentStocklRepository } from "../repositories/adjustmentStockRepository.js";
import { ApiResponse, PaginatedResponse } from "../types/commons.js";
import { RegisterAjustmentStockInput } from "../types/inputs.js";
import { EMPTY_DATA_COUNT } from "../utills/conts.js";
import { pagination } from "../utills/paginate.js";
import { getUserByUuid } from "./userService.js";

export const newAdjustmentStock = async (
  registerAjustmentStockinput: RegisterAjustmentStockInput,
): Promise<ApiResponse<AdjustmentResponseDto>> => {
  return await AppDataSource.transaction(async (manager) => {
    const productRepository = manager.getRepository(Product);
    const adjustmentRepository = manager.getRepository(StockAdjustment);

    const { userUuid, productUuid, newRegisterAjustmentStockData } =
      registerAjustmentStockinput;
    const { newStock, reason, note } = newRegisterAjustmentStockData;
    await getUserByUuid(userUuid, manager);

    const foundProduct = await productRepository.findOne({
      where: { uuid: productUuid },
      lock: { mode: "pessimistic_write" },
    });

    if (!foundProduct) {
      throw new AppError("Product not found", 404);
    }

    const expectedStock = foundProduct.stock;
    const difference = newStock - foundProduct.stock;
    const newAdjustment = adjustmentRepository.create({
      productUuid: foundProduct.uuid,
      expectedStock,
      actualStock: newStock,
      difference,
      reason: reason ?? "Auditory",
      note: note ?? "No note",
      adjustedByUuid: userUuid,
    });

    foundProduct.stock = newStock;

    await productRepository.save(foundProduct);
    await adjustmentRepository.save(newAdjustment);

    return {
      success: true,
      message: "Adjustment registered successfully",
      data: {
        uuid: newAdjustment.uuid,
        productId: newAdjustment.productUuid,
        expectedStock,
        actualStock: newAdjustment.actualStock,
        difference,
        createdAt: newAdjustment.createdAt.toISOString(),
        adjustedById: newAdjustment.adjustedByUuid,
      },
    };
  });
};

export const getAdjustmentsStock = async (
  adjustmentFilters: GetAjustmentStockFiltersDto,
): Promise<PaginatedResponse<AdjustmentResponseDto>> => {
  const query = adjustmentStocklRepository
    .createQueryBuilder("adjustment")
    .leftJoinAndSelect("adjustment.product", "product")
    .leftJoinAndSelect("adjustment.adjustedBy", "user")
    .select([
      "adjustment.uuid",
      "adjustment.difference",
      "adjustment.expectedStock",
      "adjustment.actualStock",
      "adjustment.createdAt",
      "adjustment.adjustedByUuid",
      "product.uuid",
      "product.name",
      "user.uuid",
      "user.name",
    ]);

  if (adjustmentFilters.productId) {
    query.andWhere("adjustment.productUuid = :productUuid", {
      productUuid: adjustmentFilters.productId,
    });
  }

  if (adjustmentFilters.adjustedById) {
    query.andWhere("user.email ILIKE :email", {
      email: `%${adjustmentFilters.adjustedById}%`,
    });
  }

  if (adjustmentFilters.difference !== undefined) {
    query.andWhere("adjustment.difference = :difference", {
      difference: adjustmentFilters.difference,
    });
  }

  if (adjustmentFilters.expectedStock !== undefined) {
    query.andWhere("adjustment.expectedStock = :expectedStock", {
      expectedStock: adjustmentFilters.expectedStock,
    });
  }

  if (adjustmentFilters.startDate) {
    query.andWhere("adjustment.createdAt >= :startDate", {
      startDate: adjustmentFilters.startDate,
    });
  }

  if (adjustmentFilters.endDate) {
    query.andWhere("adjustment.createdAt <= :endDate", {
      endDate: adjustmentFilters.endDate,
    });
  }

  const paginationValues = pagination(
    adjustmentFilters.page,
    adjustmentFilters.limit,
  );

  query.take(paginationValues.limit);
  query.skip(paginationValues.skip);

  const [adjustments, total] = await query.getManyAndCount();

  if (adjustments.length === EMPTY_DATA_COUNT) {
    return {
      success: false,
      message: "No adjustments registered",
      total: 0,
      page: paginationValues.page,
      limit: paginationValues.limit,
      totalPages: Math.ceil(total / paginationValues.limit),
      data: [],
    };
  }
  const data: AdjustmentResponseDto[] = adjustments.map((adj) => ({
    uuid: adj.uuid,
    productId: adj.product.uuid || adj.productUuid,
    adjustedById: adj.adjustedByUuid,
    expectedStock: adj.expectedStock,
    actualStock: adj.actualStock,
    difference: adj.difference,
    createdAt: adj.createdAt.toISOString(),
  }));
  return {
    success: true,
    message: "Adjustments retrieved successfully",
    total,
    page: paginationValues.page,
    limit: paginationValues.limit,
    totalPages: Math.ceil(total / paginationValues.limit),
    data: data,
  };
};

export const getAdjustmentByUuid = async (
  adjustmentUuid: string,
): Promise<ApiResponse<AdjustmentResponseDto>> => {
  const foundAdjustment = await adjustmentStocklRepository.findOneBy({
    uuid: adjustmentUuid,
  });

  if (!foundAdjustment) {
    throw new AppError("Adjustment movement not found", 404);
  }
  const data: AdjustmentResponseDto = {
    uuid: foundAdjustment.uuid,
    productId: foundAdjustment.productUuid,
    adjustedById: foundAdjustment.adjustedByUuid,
    expectedStock: foundAdjustment.expectedStock,
    actualStock: foundAdjustment.actualStock,
    difference: foundAdjustment.difference,
    createdAt: foundAdjustment.createdAt.toISOString(),
  };

  return {
    success: true,
    message: "Adjustment found successfully",
    data: data,
  };
};
