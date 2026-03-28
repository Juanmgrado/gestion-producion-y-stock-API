import { Product } from "../entities/product.entity.js";
import { productRepository } from "../repositories/productRepository.js";

export const getProduct = async () => {
  const productList = await productRepository.find();
  if (productList.length === 0) {
    return "No products list";
  }

  return productList;
};

export const createProduct = async (newProduct: string) => {
  const productExisting = await productRepository.findOneBy({
    name: newProduct,
  });

  if (productExisting) {
    throw new Error("Product already exists");
  }
  const product = productRepository.create({ name: newProduct });

  await productRepository.save(product);

  return product;
};

export const findProductById = async (productId: string, manager?: any) => {
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
