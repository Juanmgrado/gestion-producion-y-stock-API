import { describe, it, expect, vi } from "vitest";
import { verifyAdmin } from "./verifyIsAdmin.middleware.js";

function createMockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    clearCookie: vi.fn(),
  };
}

describe("VerifyAdmin", () => {
  it("should respond with 401 code when user is not authenticated", () => {
    const req = {};
    const res = createMockRes();
    const next = vi.fn();

    verifyAdmin(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should respond with 403 code when the user has not rol admin", () => {
    const req = { user: { isAdmin: false } };
    const res = createMockRes();
    const next = vi.fn();

    verifyAdmin(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Admin access required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() when the user is admin", () => {
    const req = { user: { isAdmin: true } };
    const res = createMockRes();
    const next = vi.fn();

    verifyAdmin(req as any, res as any, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
