import { describe, it, expect, vi } from "vitest";
import { loginUser } from "./authService.js";
import * as userService from "./userService.js";
import * as bcrypt from "bcrypt";

vi.mock("./userService.js");
vi.mock("bcrypt");

describe("loginUser", () => {
  it("should throw 403 when the user is inactive", async () => {
    const loginDto = { email: "test@test.com", password: "123456" };

    vi.mocked(userService.getUserByEmail).mockResolvedValue({
      email: "test@test.com",
      password: "hashed-password",
      isActive: false,
    } as any);

    await expect(loginUser(loginDto as any)).rejects.toThrow(
      "The user is not active. Contact an admin.",
    );
  });

  it("should throw 401 when the password does not match", async () => {
    const loginDto = { email: "test@test.com", password: "wrong-password" };

    vi.mocked(userService.getUserByEmail).mockResolvedValue({
      email: "test@test.com",
      password: "hashed-password",
      isActive: true,
    } as any);

    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    await expect(loginUser(loginDto as any)).rejects.toThrow(
      "User or password incorrect",
    );
  });

  it("should resolve with tokens when login is successful", async () => {
    const loginDto = { email: "test@test.com", password: "correct-password" };

    vi.mocked(userService.getUserByEmail).mockResolvedValue({
      email: "test@test.com",
      password: "hashed-password",
      isActive: true,
    } as any);

    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    await expect(loginUser(loginDto as any)).resolves.toMatchObject({
      success: true,
      message: "Logged in successfully",
      data: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      },
    });
  });
});
