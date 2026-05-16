import { AppDataSource } from "../config/dataSource.js";
import { GetMovementsFiltersDto } from "../dto/movement/getMovementsFilters.dto.js";
import { MovementResponse } from "../dto/movement/newMovementResponse.js";
import { Product } from "../entities/product.entity.js";
import { StockMovement } from "../entities/stockMovement.entity.js";
import { stockMovementRepository } from "../repositories/stockMovementRepository.js";
import { PaginatedResponse } from "../types/commons.js";
import { RegisterNewMovementInput } from "../types/inputs.js";
import { checkAndModifyStock } from "../utills/checkAndModifyStock.js";
import { DEFAULT_PAGE, LIMIT_PAGE, EMPTY_DATA_COUNT } from "../utills/conts.js";
import { pagination } from "../utills/paginate.js";
import { getuserById } from "./userService.js";

export const getMovements = async (
  stockMovementsFilters: GetMovementsFiltersDto,
): Promise<PaginatedResponse<MovementResponse>> => {
  const qb = stockMovementRepository
    .createQueryBuilder("movement")
    .leftJoinAndSelect("movement.user", "user")
    .leftJoinAndSelect("movement.product", "product")
    .select([
      "movement.uuid",
      "movement.createdAt",
      "product.uuid",
      "movement.quantity",
      "movement.typeMovement",
      "user.name",
    ]);

  if (stockMovementsFilters.productUuid) {
    qb.andWhere("movement.productUuid = :productUuid", {
      productUuid: stockMovementsFilters.productUuid,
    });
  }

  if (stockMovementsFilters.userUuid) {
    qb.andWhere("movement.userUuid = :user", {
      userUuid: stockMovementsFilters.userUuid,
    });
  }

  if (stockMovementsFilters.movementType) {
    qb.andWhere("movement.typeMovement = :movementType", {
      movementType: stockMovementsFilters.movementType,
    });
  }

  if (stockMovementsFilters.startDate) {
    qb.andWhere("movement.createdAt >= :startDate", {
      startDate: stockMovementsFilters.startDate,
    });
  }

  if (stockMovementsFilters.endDate) {
    qb.andWhere("movement.createdAt <= :endDate", {
      endDate: stockMovementsFilters.endDate,
    });
  }

  if (stockMovementsFilters.minQuantity !== undefined) {
    qb.andWhere("movement.quantity >= :minQuantity", {
      minQuantity: stockMovementsFilters.minQuantity,
    });
  }

  if (stockMovementsFilters.maxQuantity !== undefined) {
    qb.andWhere("movement.quantity <= :maxQuantity", {
      maxQuantity: stockMovementsFilters.maxQuantity,
    });
  }

  if (stockMovementsFilters.note) {
    qb.andWhere("movement.note ILIKE :note", {
      note: `%${stockMovementsFilters.note}%`,
    });
  }

  qb.orderBy("movement.createdAt", "DESC");

  const paginationValues = pagination(
    stockMovementsFilters.page,
    stockMovementsFilters.limit,
  );
  
  console.log(paginationValues.page, stockMovementsFilters.limit)

  const total = await qb.getCount();

  const movements: MovementResponse[] = await qb
    .offset(paginationValues.skip)
    .limit(stockMovementsFilters.limit)
    .getRawMany();

  if (movements.length === EMPTY_DATA_COUNT) {
    return {
      success: false,
      message: "No movements registered",
      total: 0,
      page: paginationValues.page,
      limit: paginationValues.limit,
      totalPages: 0,
      data: [],
    };
  }

  return {
    success: true,
    message: "Movements retrieved successfully",
    total: total,
    page: paginationValues.page,
    limit: paginationValues.limit,
    totalPages: Math.ceil(total / paginationValues.limit),
    data: movements,
  };
};

export const getStockMovementById = async (movementId: any, manager?: any) => {
  const repo = manager
    ? manager.getRepository(StockMovement)
    : stockMovementRepository;

  const foundMovement = await repo.findOneBy({ id: movementId });
  if (!foundMovement) {
    throw new Error("Movement not found");
  }

  return foundMovement;
};

export const registerMovement = async (
  newMovementInput: RegisterNewMovementInput,
): Promise<MovementResponse> => {
  const { userUuid, productUuid } = newMovementInput;
  const { newMovementData } = newMovementInput;
  const { quantity, typeMovement, note } = newMovementData;

  return await AppDataSource.transaction(async (manager) => {
    const productRepository = manager.getRepository(Product);
    const movementRepository = manager.getRepository(StockMovement);

    const foundProduct = await productRepository.findOne({
      where: { uuid: productUuid },
      lock: { mode: "pessimistic_write" },
    });

    const foundUser = await getuserById(userUuid, manager);

    if (!foundProduct) {
      throw new Error("Product not found");
    }

    const newStock = checkAndModifyStock(
      typeMovement,
      quantity,
      foundProduct.stock,
    );

    foundProduct.stock = newStock;

    const newMovement = movementRepository.create({
      quantity,
      typeMovement: typeMovement,
      note: note ?? "No note",
      product: foundProduct,
      user: foundUser,
    });

    await productRepository.save(foundProduct);
    await movementRepository.save(newMovement);

    const newMovementResponse: MovementResponse = {
      uuid: newMovement.uuid,
      quantity: newMovement.quantity,
      note: newMovement.note,
      typeMovement: newMovement.typeMovement,
      productUuid: newMovement.product.uuid,
      createdAt: newMovement.createdAt,
    };

    return newMovementResponse;
  });
};
