import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyToken } from "./verifyToken.middleware.js";
import jwt from "jsonwebtoken";
import * as userService from "../services/userService.js";

vi.mock("../services/userService.js");

function createMockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    clearCookie: vi.fn(),
  };
}

describe("verifyToken", () => {
  it("should respond 401 when there is no accessToken cookie", async () => {
    const req = { cookies: {} } as any;
    const res = createMockRes();
    const next = vi.fn();

    await verifyToken(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Access denied" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should respond 401 when the token is invalid", async () => {
    const req = { cookies: { accessToken: "a-token-novalid" } } as any;
    const res = createMockRes();
    const next = vi.fn();

    await verifyToken(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should respond 403 when the user is inactive", async () => {
    const validToken = jwt.sign(
      { uuid: "user-123", email: "test@test.com", isAdmin: false },
      process.env.JWT_SECRET!,
    );
    const req = { cookies: { accessToken: validToken } } as any;
    const res = createMockRes();
    const next = vi.fn();

    vi.mocked(userService.getUserByUuid).mockResolvedValue({
      uuid: "user-123",
      isActive: false,
    } as any);

    await verifyToken(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "The user is not active. Contact an admin.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() when the token and user are valid", async () => {
    const payload = {
      uuid: "user-123",
      email: "test@test.com",
      isAdmin: false,
    };
    const validToken = jwt.sign(payload, process.env.JWT_SECRET!);
    const req = { cookies: { accessToken: validToken } } as any;
    const res = createMockRes();
    const next = vi.fn();

    vi.mocked(userService.getUserByUuid).mockResolvedValue({
      uuid: "user-123",
      isActive: true,
    } as any);

    await verifyToken(req, res as any, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(req.user).toMatchObject(payload);
    expect(next).toHaveBeenCalled();
  });

  it("should respond 403 when the user does not exist", async () => {
    const validToken = jwt.sign(
      { uuid: "user-123", email: "test@test.com", isAdmin: false },
      process.env.JWT_SECRET!,
    );
    const req = { cookies: { accessToken: validToken } } as any;
    const res = createMockRes();
    const next = vi.fn();

    vi.mocked(userService.getUserByUuid).mockResolvedValue(null as any);

    await verifyToken(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "The user is not active. Contact an admin.",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
