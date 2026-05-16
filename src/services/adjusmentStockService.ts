import { AppDataSource } from "../config/dataSource.js";
import { AdjustmentResponseDto } from "../dto/adjustment/adjustmentResponse.dto.js";
import { GetAjustmentStockFiltersDto } from "../dto/adjustment/getAjusmentStock.dto.js";
import { StockAdjustment } from "../entities/adjustmentStock.entity.js";
import { Product } from "../entities/product.entity.js";
import { adjustmentStocklRepository } from "../repositories/adjusmentStockRepository.js";
import { PaginatedResponse } from "../types/commons.js";
import { RegisterAjustmentStockInput } from "../types/inputs.js";
import { DEFAULT_PAGE, EMPTY_DATA_COUNT, LIMIT_PAGE } from "../utills/conts.js";
import { pagination } from "../utills/paginate.js";
import { getuserById } from "./userService.js";

export const newAdjustmentStock = async (
  registerAjustmentStockinput: RegisterAjustmentStockInput,
): Promise<AdjustmentResponseDto> => {
  return await AppDataSource.transaction(async (manager) => {
    const productRepository = manager.getRepository(Product);
    const adjustmentRepository = manager.getRepository(StockAdjustment);

    const { userUuid, productUuid, newRegisterAjustmentStockData } =
      registerAjustmentStockinput;
    const { newStock, reason, note } = newRegisterAjustmentStockData;
    await getuserById(userUuid, manager);

    const foundProduct = await productRepository.findOne({
      where: { uuid: productUuid },
      lock: { mode: "pessimistic_write" },
    });
  
    if (!foundProduct) {
      throw new Error("Product not found");
    }

    const expectedStock = foundProduct.stock;
    const difference = newStock - foundProduct.stock;
    const newAdjustment = adjustmentRepository.create({
      productId: foundProduct.uuid,
      expectedStock,
      actualStock: newStock,
      difference,
      reason: reason ?? "Auditory",
      note: note ?? "No note",
      adjustedById: "db2ba2f6-9645-46c7-9521-d8478ed532c3",
    });

    foundProduct.stock = newStock;

    await productRepository.save(foundProduct);
    await adjustmentRepository.save(newAdjustment);

    return {
      uuid: newAdjustment.uuid,
      productId: newAdjustment.productId,
      expectedStock,
      actualStock: newAdjustment.actualStock,
      difference,
      createdAt: newAdjustment.createdAt.toISOString(),
      adjustedById: newAdjustment.adjustedById
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
      "adjustment.adjustedById", 
      "product.uuid",
      "product.name",
      "user.uuid",
      "user.name",
    ]);

  if (adjustmentFilters.productId) {
    query.andWhere("adjustment.productId = :productId", {
      productId: adjustmentFilters.productId,
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

  if(adjustments.length === EMPTY_DATA_COUNT){
    return {
      success: false,
      message: "No adjustments registered",
      total: 0,
      page: 0,
      limit: 0,
      totalPages: Math.ceil(total / paginationValues.limit),
      data: [],
    };
  }
  const data: AdjustmentResponseDto[] = adjustments.map((adj) => ({
    uuid: adj.uuid,
    productId: adj.product.uuid || adj.productId,
    adjustedById: adj.adjustedById,
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
