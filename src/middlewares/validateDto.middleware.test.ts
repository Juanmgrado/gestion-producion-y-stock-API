import { describe, it, expect, vi } from "vitest";
import { validateDto } from "./validateDto.middleware.js";
import { CreateProductDto } from "../dto/product/createProduct.dto.js";

function createMockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
}

describe("validateDto", () => {
  it("should respond 400 when the body is invalid", async () => {
    const req = { body: { name: "ab" } } as any;
    const res = createMockRes();
    const next = vi.fn();

    const middleware = validateDto(CreateProductDto);
    await middleware(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() when the body is valid", async () => {
    const req = { body: { name: "Producto válido", stock: 10 } } as any;
    const res = createMockRes();
    const next = vi.fn();

    const middleware = validateDto(CreateProductDto);
    await middleware(req, res as any, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
