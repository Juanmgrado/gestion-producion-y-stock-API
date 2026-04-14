import { AppDataSource } from "../config/dataSource.js";
import { Product } from "../entities/product.entity.js";
import { productRepository } from "../repositories/productRepository.js";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  LIMIT_PAGE_PRODUCTS,
  MIN_DATA_LIST,
} from "../utills/conts.js";
import { getuserById } from "./userService.js";

export const getProduct = async (filtersProduct: any) => {
  const {
    name,
    isActive,
    minStock,
    maxStock,
    createdBy,
    sortBy,
    order,
    page,
    limit,
  } = filtersProduct;

  const query = productRepository
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.user", "user");

  if (name) {
    query.andWhere("product.name ILIKE :name", {
      name: `%${name}%`,
    });
  }

  if (isActive !== undefined) {
    query.andWhere("product.isActive = :isActive", {
      isActive: isActive === "true",
    });
  }

  if (minStock) {
    query.andWhere("product.stock >= :minStock", {
      minStock: Number(minStock),
    });
  }

  if (maxStock) {
    query.andWhere("product.stock <= :maxStock", {
      maxStock: Number(maxStock),
    });
  }

  if (createdBy) {
    query.andWhere("user.id = :createdBy", {
      createdBy,
    });
  }

  if (sortBy) {
    query.orderBy(`product.${sortBy}`, order === "ASC" ? "ASC" : "DESC");
  }

  const pageNumber = page ? Number(page) : DEFAULT_PAGE;
  const take = limit ? Number(limit) : DEFAULT_LIMIT;
  const skip = (pageNumber - 1) * take;

  query.take(take).skip(skip);

  const productList = await query.getMany();

  if (productList.length === MIN_DATA_LIST) {
    return "No products found";
  }

  return productList;
};

export const createProduct = async (userId, newProduct: string) => {
  const foundUser = await getuserById(userId);
  const productExisting = await productRepository.findOneBy({
    name: newProduct,
  });

  if (productExisting) {
    throw new Error("Product already exists");
  }
  const product = productRepository.create({ name: newProduct });

  product.user = foundUser;

  await productRepository.save(product);

  return product;
};

export const getProductById = async (productId: string, manager?: any) => {
  const repo = manager ? manager.getRepository(Product) : productRepository;
  const foundProduct = await repo.findOneBy({ id: productId });

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
