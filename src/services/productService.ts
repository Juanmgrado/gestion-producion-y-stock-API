import { EntityManager } from "typeorm";
import { GetProductFiltersDto } from "../dto/product/getProductFilters.dto.js";
import { ProductResponseDto } from "../dto/product/productResponse.js";
import { Product } from "../entities/product.entity.js";
import { productRepository } from "../repositories/productRepository.js";
import { PaginatedResponse } from "../types/commons.js";
import { CreateNewProductInput } from "../types/inputs.js";
import {
} from "../types/interfaces.js";
import {
  EMPTY_DATA_COUNT,
} from "../utills/conts.js";
import { pagination } from "../utills/paginate.js";
import { getuserById } from "./userService.js";

export const getProducts = async (
  filtersProduct: GetProductFiltersDto,
): Promise<PaginatedResponse<ProductResponseDto>> => {
  const { name, isActive, minStock, maxStock, createdBy, page, limit } =
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

  if (createdBy) {
    query.andWhere("user.id = :createdBy", { createdBy });
  }

  const paginationValues = pagination(page, limit)

  query.take(paginationValues.limit);
  query.skip(paginationValues.skip);

  const [productList, total] = await query.getManyAndCount();
  const data: ProductResponseDto[] = productList.map((product) => ({
    uuid: product.uuid,
    name: product.name,
    stock: product.stock,
    isActive: product.isActive,
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
): Promise<ProductResponseDto> => {
  const foundUser = await getuserById(newProductInput.userUuid);
  const { name, stock } = newProductInput.newProductData;

  const foundProduct = await productRepository.findOneBy({
    name: name,
  });

  if (foundProduct) {
    throw new Error("Product already exists");
  }

  const createdProduct = productRepository.create({
    name: name,
    user: foundUser,
    ...(stock !== undefined && { stock: stock }),
  });

  await productRepository.save(createdProduct);

  return {
    uuid: createdProduct.uuid,
    name: createdProduct.name,
    stock: createdProduct.stock,
    isActive: createdProduct.isActive,
  };
};

export const getProductById = async (
  productId: string,
  manager?: EntityManager,
): Promise<ProductResponseDto> => {
  const repo = manager ? manager.getRepository(Product) : productRepository;
  const foundProduct = await repo.findOneBy({ uuid: productId });

  if (!foundProduct) {
    throw new Error("Product not found");
  }

  return foundProduct;
};

export const deletProduct = async (name: string) => {
  const foundProduct = await productRepository.findOneBy({ name: name });

  if (!foundProduct) {
    throw new Error("Product not found");
  }

  foundProduct.isActive = false;

  const deletedProduct = await productRepository.save(foundProduct);

  return deletedProduct;
};
