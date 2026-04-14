import { productRepository } from "../repositories/productRepository.js";
import { MIN_DATA_LIST } from "./conts.js";

export default async function createProductsList() {

  const productExisting = await productRepository.find()
  const productnames = productExisting.map(({name}) => name)
  const productsToInsert = ["sirope menta", "sirope albahaca"]
    .filter((name) => !productnames.includes(name))
    .map((name) => ({ name }));

  if (productsToInsert.length > MIN_DATA_LIST) {
    await productRepository.insert(productsToInsert);
    console.log("Products loaded");
  } else {
    console.log("No products to load");
  }
}
