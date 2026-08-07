import { describe, it, expect, vi } from "vitest";
import { AppError, errorHandler } from "./errorHandler.middleware.js";

function createMockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
}

function createMockReq() {
  return { method: "GET", url: "/api/product" };
}

describe("errorHandler", () => {
  it("should respond 401 when the error is a JsonWebTokenError", () => {
    const err = { name: "JsonWebTokenError", message: "jwt malformed" };
    const req = createMockReq();
    const res = createMockRes();
    const next = vi.fn();

    errorHandler(err, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Invalid token",
    });
  });

  it("should respond 401 when the error is a TokenExpiredError", () => {
    const err = { name: "TokenExpiredError", message: "jwt expired" };
    const req = createMockReq();
    const res = createMockRes();
    const next = vi.fn();

    errorHandler(err, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Expired token",
    });
  });

  it("should respond 400 when the error is a Postgres invalid identifier (22P02)", () => {
    const err = { code: "22P02", message: "invalid input syntax" };
    const req = createMockReq();
    const res = createMockRes();
    const next = vi.fn();

    errorHandler(err, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Invalid identifier format",
    });
  });

  it("should respond with the AppError's own status and message when isOperational", () => {
    const err = new AppError("Product not found", 404);
    const req = createMockReq();
    const res = createMockRes();
    const next = vi.fn();

    errorHandler(err, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Product not found",
    });
  });

  it("should respond 500 with a generic message for unexpected errors", () => {
    const err = { message: "something exploded unexpectedly" };
    const req = createMockReq();
    const res = createMockRes();
    const next = vi.fn();

    errorHandler(err, req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Internal server error.",
    });
  });
});
