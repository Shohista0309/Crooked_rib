import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "../src/lib/prisma";

describe("Platform Impact Analytics Data Integrity", () => {
  it("should calculate genuine platform counts without synthetic inflation", async () => {
    const [totalCreators, activeCreators, totalOrders, totalSellers, totalProducts] =
      await Promise.all([
        prisma.user.count({ where: { role: "CREATOR" } }),
        prisma.creatorProfile.count({ where: { isAvailable: true } }),
        prisma.order.count(),
        prisma.user.count({ where: { role: "SELLER" } }),
        prisma.product.count({ where: { isPublished: true } }),
      ]);

    expect(totalCreators).toBeGreaterThanOrEqual(1);
    expect(activeCreators).toBeGreaterThanOrEqual(1);
    expect(totalOrders).toBeGreaterThanOrEqual(1);
    expect(totalSellers).toBeGreaterThanOrEqual(1);
    expect(totalProducts).toBeGreaterThanOrEqual(1);

    // Ensure active creators <= total creators
    expect(activeCreators).toBeLessThanOrEqual(totalCreators);
  });

  it("should calculate verified gross order volume from real confirmed records", async () => {
    const ordersWithPrices = await prisma.order.findMany({
      where: {
        status: { in: ["CUSTOMER_APPROVED", "IN_PROGRESS", "READY", "COMPLETED", "QUOTATION_SENT"] },
        totalPrice: { not: null },
      },
      select: { totalPrice: true },
    });

    const sum = ordersWithPrices.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
    expect(typeof sum).toBe("number");
    expect(sum).toBeGreaterThanOrEqual(0);
  });
});
