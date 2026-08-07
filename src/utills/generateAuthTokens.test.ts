import { describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";
import { generateAuthTokens } from "./generateAuthTokens.js";

describe("generateAuthTokens", () => {
  it("should generate tokens with the correct payload", () => {
    const testUser = {
      uuid: "user-123",
      email: "testUser@mail.com",
      isAdmin: false,
    };

    const { accessToken, refreshToken } = generateAuthTokens(testUser);

    expect(typeof accessToken).toBe("string");
    expect(typeof refreshToken).toBe("string");

    const decoded = jwt.decode(accessToken) as typeof testUser;
    expect(decoded.uuid).toBe(testUser.uuid);
    expect(decoded.email).toBe(testUser.email);
    expect(decoded.isAdmin).toBe(testUser.isAdmin);
  });
});
