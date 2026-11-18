import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, signSessionToken, verifySessionToken } from "../src/lib/auth";

describe("Authentication & Security Module", () => {
  it("should securely hash passwords and verify them correctly", async () => {
    const rawPassword = "SecurePassword2026!";
    const hash = await hashPassword(rawPassword);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(rawPassword);
    expect(hash.startsWith("$2")).toBe(true);

    const isMatch = await verifyPassword(rawPassword, hash);
    expect(isMatch).toBe(true);

    const isMismatch = await verifyPassword("WrongPassword123!", hash);
    expect(isMismatch).toBe(false);
  });

  it("should sign and verify valid session JWT tokens", async () => {
    const user = {
      id: "usr_test123",
      name: "Dilnoza Rahimova",
      email: "dilnoza.tailor@crookedrib.uz",
      role: "CREATOR" as const,
    };

    const token = await signSessionToken(user);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.id).toBe(user.id);
    expect(decoded?.email).toBe(user.email);
    expect(decoded?.role).toBe("CREATOR");
  });

  it("should reject tampered or invalid JWT tokens", async () => {
    const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.token";
    const result = await verifySessionToken(invalidToken);
    expect(result).toBeNull();
  });
});
