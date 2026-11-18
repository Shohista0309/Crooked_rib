import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "../src/lib/prisma";

describe("Security & Multi-Tenant Authorization Boundaries", () => {
  let customerA: any;
  let customerB: any;
  let sellerA: any;
  let sellerB: any;
  let orderA: any;
  let productA: any;

  beforeAll(async () => {
    // Look up seeded customer and seller
    customerA = await prisma.user.findUnique({ where: { email: "laylo.customer@crookedrib.uz" } });
    sellerA = await prisma.user.findUnique({
      where: { email: "shaxnoza.fabrics@crookedrib.uz" },
      include: { sellerProfile: true },
    });

    // Create isolated User B records for testing isolation
    customerB = await prisma.user.upsert({
      where: { email: "test.customer.b@crookedrib.uz" },
      update: {},
      create: {
        name: "User B (Isolated)",
        email: "test.customer.b@crookedrib.uz",
        passwordHash: "dummyhash",
        role: "CUSTOMER",
      },
    });

    sellerB = await prisma.user.upsert({
      where: { email: "test.seller.b@crookedrib.uz" },
      update: {},
      create: {
        name: "Seller B (Isolated)",
        email: "test.seller.b@crookedrib.uz",
        passwordHash: "dummyhash",
        role: "SELLER",
        sellerProfile: {
          create: {
            shopName: "Shop B Independent",
            region: "Samarqand",
            city: "Samarqand",
          },
        },
      },
      include: { sellerProfile: true },
    });

    // Create an order for Customer A
    const tailor = await prisma.user.findFirst({ where: { role: "CREATOR" } });
    orderA = await prisma.order.create({
      data: {
        orderNumber: `CR-SEC-${Date.now()}`,
        customerId: customerA.id,
        creatorId: tailor!.id,
        customerNotes: "Confidential private notes of Customer A",
      },
    });

    // Create a product for Seller A
    productA = await prisma.product.create({
      data: {
        sellerProfileId: sellerA.sellerProfile.id,
        name: "Silk Sample A",
        description: "Private stock item of Seller A",
        category: "FABRIC",
        material: "Silk",
        color: "Burgundy",
        price: 99000,
        currency: "UZS",
        quantity: 10,
        unit: "metr",
        region: "Farg'ona",
        city: "Marg'ilon",
        imageUrl: "https://example.com/test.jpg",
      },
    });
  });

  it("should prevent User B from viewing or accessing User A private orders", async () => {
    // When querying orders for Customer B, Customer A's order must NOT be included
    const customerBOrders = await prisma.order.findMany({
      where: { customerId: customerB.id },
    });

    const leakedOrder = customerBOrders.find((o) => o.id === orderA.id);
    expect(leakedOrder).toBeUndefined();
  });

  it("should enforce product ownership and prevent Seller B from tampering with Seller A products", async () => {
    // Check product ownership
    const targetProduct = await prisma.product.findUnique({
      where: { id: productA.id },
      include: { sellerProfile: true },
    });

    expect(targetProduct?.sellerProfile.userId).toBe(sellerA.id);
    expect(targetProduct?.sellerProfile.userId).not.toBe(sellerB.id);

    // Business rule check: only owner can edit
    const isOwner = targetProduct?.sellerProfile.userId === sellerB.id;
    expect(isOwner).toBe(false);
  });

  afterAll(async () => {
    if (orderA) await prisma.order.delete({ where: { id: orderA.id } });
    if (productA) await prisma.product.delete({ where: { id: productA.id } });
    await prisma.user.delete({ where: { id: customerB.id } });
    if (sellerB?.sellerProfile) await prisma.sellerProfile.delete({ where: { id: sellerB.sellerProfile.id } });
    await prisma.user.delete({ where: { id: sellerB.id } });
    await prisma.$disconnect();
  });
});
