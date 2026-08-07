import { describe, expect, it } from "vitest";
import { checkAndModifyStock } from "./checkAndModifyStock.js";

describe("checkAndModifyStock", () => {
  it("should increase stock when type is IN", () => {
    const newStock = checkAndModifyStock("IN", 5, 10);

    expect(newStock).toBe(15);
  });

  it("should decrease stock when type is OUT", () => {
    const newStock = checkAndModifyStock("OUT", 5, 10);

    expect(newStock).toBe(5);
  });

  it("should allow OUT to bring stock exactly to zero", () => {
    const newStock = checkAndModifyStock("OUT", 10, 10);

    expect(newStock).toBe(0);
  });

  it("should reject OUT when quantity is greater than current stock", () => {
    expect(() => checkAndModifyStock("OUT", 15, 10)).toThrow(
      "Not enough stock",
    );
  });

  it("should reject a quantity of zero or less, regardless of type", () => {
    expect(() => checkAndModifyStock("IN", 0, 10)).toThrow(
      "Quantity must be greater than 0",
    );
    expect(() => checkAndModifyStock("OUT", -1, 10)).toThrow(
      "Quantity must be greater than 0",
    );
  });
});
