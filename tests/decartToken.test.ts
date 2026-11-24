import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireAuthMock, createTokenMock } = vi.hoisted(() => ({
  requireAuthMock: vi.fn(),
  createTokenMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ requireAuth: requireAuthMock }));
vi.mock("@decartai/sdk", () => ({
  createDecartClient: vi.fn(() => ({ tokens: { create: createTokenMock } })),
  models: { realtime: vi.fn((name: string) => ({ name })) },
}));

import { GET, POST } from "@/app/api/decart/realtime-token/route";

const requestOrigin = "https://crookedrib.example";

function makeRequest(body: unknown, origin = requestOrigin) {
  return new NextRequest(`${requestOrigin}/api/decart/realtime-token`, {
    method: "POST",
    headers: {
      origin,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function makeAvailabilityRequest() {
  return new NextRequest(`${requestOrigin}/api/decart/realtime-token`, {
    method: "GET",
  });
}

describe("Decart realtime client-token endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.DECART_API_KEY;
    requireAuthMock.mockResolvedValue({ user: { id: "customer-1", role: "CUSTOMER" } });
  });

  it("rejects cross-origin calls before authentication or token creation", async () => {
    const response = await POST(makeRequest({ consent: true, durationSeconds: 60 }, "https://attacker.example"));
    expect(response.status).toBe(403);
    expect(requireAuthMock).not.toHaveBeenCalled();
    expect(createTokenMock).not.toHaveBeenCalled();
  });

  it("requires a customer session", async () => {
    requireAuthMock.mockResolvedValue({ error: "Authentication required", status: 401 });
    const response = await POST(makeRequest({ consent: true, durationSeconds: 60 }));
    expect(response.status).toBe(401);
    expect(createTokenMock).not.toHaveBeenCalled();
  });

  it("requires explicit consent and an allowed session duration", async () => {
    const response = await POST(makeRequest({ consent: false, durationSeconds: 3600 }));
    expect(response.status).toBe(400);
    expect(createTokenMock).not.toHaveBeenCalled();
  });

  it("returns an explicit configuration error if the permanent key is missing", async () => {
    const response = await POST(makeRequest({ consent: true, durationSeconds: 60 }));
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({
      error: expect.stringContaining("DECART_API_KEY"),
    });
    expect(createTokenMock).not.toHaveBeenCalled();
  });

  it("reports Decart unavailable without exposing server credentials", async () => {
    const response = await GET(makeAvailabilityRequest());
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({ configured: false });
  });

  it("reports a server-configured service without returning its key", async () => {
    process.env.DECART_API_KEY = "server-only-test-key";
    const response = await GET(makeAvailabilityRequest());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ configured: true });
    expect(createTokenMock).not.toHaveBeenCalled();
  });

  it("scopes short-lived tokens to Lucy VTON, this origin, and the selected duration", async () => {
    process.env.DECART_API_KEY = "server-only-test-key";
    createTokenMock.mockResolvedValue({
      apiKey: "short-lived-client-token",
      expiresAt: "2026-11-24T00:01:00.000Z",
    });

    const response = await POST(makeRequest({ consent: true, durationSeconds: 120 }));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(createTokenMock).toHaveBeenCalledWith({
      expiresIn: 60,
      allowedModels: ["lucy-vton-3.6"],
      allowedOrigins: [requestOrigin],
      constraints: { realtime: { maxSessionDuration: 120 } },
    });
    expect(await response.json()).toEqual({
      apiKey: "short-lived-client-token",
      expiresAt: "2026-11-24T00:01:00.000Z",
    });
  });
});
