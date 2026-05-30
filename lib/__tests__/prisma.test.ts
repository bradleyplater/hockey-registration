import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Reset modules before each test so we get a fresh module evaluation.
// This is necessary because lib/prisma.ts sets a globalThis singleton on load —
// without resetting, the second import returns the already-cached instance.
beforeEach(() => {
  vi.resetModules();
  // Also clear the globalThis cache so the factory re-runs on each import.
  const g = globalThis as unknown as { prisma?: unknown };
  delete g.prisma;
});

afterEach(() => {
  // Restore all env var stubs so mutations don't bleed between tests.
  vi.unstubAllEnvs();
});

describe("Prisma client singleton", () => {
  it("exports a prisma client with the expected interface when DATABASE_URL is set", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:password@localhost:5432/hockey_registration");

    const { prisma } = await import("../prisma");

    expect(prisma).toBeDefined();
    expect(typeof prisma.$connect).toBe("function");
    expect(typeof prisma.$disconnect).toBe("function");
  });

  it("throws a clear error when DATABASE_URL is missing", async () => {
    vi.stubEnv("DATABASE_URL", "");

    await expect(import("../prisma")).rejects.toThrow("DATABASE_URL");
  });
});
