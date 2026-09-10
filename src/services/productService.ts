import { EntityManager } from "typeorm";
import { GetProductFiltersDto } from "../dto/product/getProductFilters.dto.js";
import { ProductResponseDto } from "../dto/product/productResponse.dto.js";
import { Product } from "../entities/product.entity.js";
import { AppError } from "../middlewares/errorHandler.middleware.js";
import { productRepository } from "../repositories/productRepository.js";
import { ApiResponse, PaginatedResponse } from "../types/common.js";
import { CreateNewProductInput, UpdateProductInput } from "../types/inputs.js";
import { EMPTY_DATA_COUNT } from "../utills/consts.js";
import { pagination } from "../utills/paginate.js";
import { getUserByUuid } from "./userService.js";

export const getProducts = async (
  filtersProduct: GetProductFiltersDto,
  isAdmin: boolean = false,
): Promise<PaginatedResponse<ProductResponseDto>> => {
  const { name, isActive, minStock, maxStock, createdBy, page, limit, sortBy, order } =
    filtersProduct;
  const query = productRepository
    .createQueryBuilder("product")
    .leftJoin("product.user", "user")
    .select([
      "product.uuid",
      "product.name",
      "product.stock",
      "product.isActive",
      "user.uuid",
      "user.name",
    ]);

  if (name) {
    query.andWhere("product.name ILIKE :name", { name: `%${name}%` });
  }

  if (isActive !== undefined) {
    query.andWhere("product.isActive = :isActive", { isActive });
  }

  if (minStock !== undefined) {
    query.andWhere("product.stock >= :minStock", {
      minStock: Number(minStock),
    });
  }

  if (maxStock !== undefined) {
    query.andWhere("product.stock <= :maxStock", {
      maxStock: Number(maxStock),
    });
  }

  if (isAdmin && createdBy) {
    query.andWhere("user.uuid = :createdBy", { createdBy });
  }

  // "createdAt" is a valid ProductSortBy value but the entity has no such
  // column, so ordering by it would blow up the query.
  const SORTABLE_COLUMNS = ["name", "stock", "isActive"];
  if (sortBy && SORTABLE_COLUMNS.includes(sortBy)) {
    query.orderBy(`product.${sortBy}`, order === "ASC" ? "ASC" : "DESC");
  }

  const paginationValues = pagination(page, limit);

  query.take(paginationValues.limit);
  query.skip(paginationValues.skip);

  const [productList, total] = await query.getManyAndCount();
  const data: ProductResponseDto[] = productList.map((product) => ({
    uuid: product.uuid,
    name: product.name,
    stock: product.stock,
    isActive: product.isActive,
    ...(isAdmin && product.user
      ? { createdBy: { uuid: product.user.uuid, name: product.user.name } }
      : {}),
  }));

  if (data.length === EMPTY_DATA_COUNT) {
    return {
      success: true,
      message: "No products found",
      total: 0,
      page: paginationValues.page,
      limit: paginationValues.limit,
      totalPages: Math.ceil(total / paginationValues.limit),
      data,
    };
  }

  return {
    success: true,
    message: "Products retrieved successfully",
    total: total,
    page: paginationValues.page,
    limit: paginationValues.limit,
    totalPages: Math.ceil(total / paginationValues.limit),
    data,
  };
};

export const createProduct = async (
  newProductInput: CreateNewProductInput,
): Promise<ApiResponse<ProductResponseDto>> => {
  const foundUser = await getUserByUuid(newProductInput.userUuid);
  const { name, stock } = newProductInput.newProductData;

  const foundProduct = await productRepository.findOneBy({
    name: name,
  });

  if (foundProduct) {
    throw new AppError("Product already exists", 409);
  }

  const createdProduct = productRepository.create({
    name: name,
    user: foundUser,
    ...(stock !== undefined && { stock: stock }),
  });

  await productRepository.save(createdProduct);

  return {
    success: true,
    message: "Product created successfully",
    data: {
      uuid: createdProduct.uuid,
      name: createdProduct.name,
      stock: createdProduct.stock,
      isActive: createdProduct.isActive,
    },
  };
};

export const getProductByUuid = async (
  productUuid: string,
  manager?: EntityManager,
): Promise<ProductResponseDto> => {
  const repo = manager ? manager.getRepository(Product) : productRepository;
  const foundProduct = await repo.findOneBy({ uuid: productUuid });

  if (!foundProduct) {
    throw new AppError("Product not found", 404);
  }

  return foundProduct;
};

export const findProductByUuid = async (
  productUuid: string,
): Promise<ApiResponse<ProductResponseDto>> => {
  const product = await getProductByUuid(productUuid);

  return {
    success: true,
    message: "Product found successfully",
    data: {
      uuid: product.uuid,
      name: product.name,
      stock: product.stock,
      isActive: product.isActive,
    },
  };
};

export const deleteProduct = async (
  productUuid: string,
): Promise<ApiResponse<ProductResponseDto>> => {
  const foundProduct = await getProductByUuid(productUuid);

  if (!foundProduct.isActive) {
    throw new AppError("Product is already inactive", 409);
  }

  foundProduct.isActive = false;

  await productRepository.save(foundProduct);

  return {
    success: true,
    message: "Product deleted successfully",
    data: {
      uuid: foundProduct.uuid,
      name: foundProduct.name,
      stock: foundProduct.stock,
      isActive: foundProduct.isActive,
    },
  };
};

export const updateProduct = async (
  updateProductInput: UpdateProductInput,
): Promise<ApiResponse<ProductResponseDto>> => {
  const { uuid } = updateProductInput;
  const { name } = updateProductInput.updateProductData;
  const foundProduct = await getProductByUuid(uuid);

  if (!foundProduct.isActive) {
    throw new AppError("Cannot modify an inactive product", 409);
  }

  if (name !== foundProduct.name) {
    const nameInUse = await productRepository.findOneBy({ name });
    if (nameInUse) {
      throw new AppError("Product already exists", 409);
    }
    foundProduct.name = name;
  }

  await productRepository.save(foundProduct);

  return {
    success: true,
    message: "Product updated successfully",
    data: {
      uuid: foundProduct.uuid,
      name: foundProduct.name,
      stock: foundProduct.stock,
      isActive: foundProduct.isActive,
    },
  };
};
