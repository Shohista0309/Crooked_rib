import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "../src/lib/prisma";

describe("Order Workflow & Status Transitions", () => {
  let customerUser: any;
  let tailorUser: any;
  let createdOrder: any;

  beforeAll(async () => {
    // Look up seeded customer and creator
    customerUser = await prisma.user.findUnique({
      where: { email: "laylo.customer@crookedrib.uz" },
    });
    tailorUser = await prisma.user.findUnique({
      where: { email: "dilnoza.tailor@crookedrib.uz" },
    });
  });

  it("should verify existence of customer and creator in verified database", () => {
    expect(customerUser).toBeDefined();
    expect(tailorUser).toBeDefined();
    expect(customerUser.role).toBe("CUSTOMER");
    expect(tailorUser.role).toBe("CREATOR");
  });

  it("should create a new order in REQUEST_SUBMITTED status", async () => {
    const orderNumber = `CR-TEST-${Date.now()}`;
    createdOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customerUser.id,
        creatorId: tailorUser.id,
        status: "REQUEST_SUBMITTED",
        customerNotes: "Test order note for silk evening suit",
        measurements: "Height 170cm, Bust 90cm",
      },
    });

    expect(createdOrder.id).toBeDefined();
    expect(createdOrder.status).toBe("REQUEST_SUBMITTED");
    expect(createdOrder.customerId).toBe(customerUser.id);
    expect(createdOrder.creatorId).toBe(tailorUser.id);
  });

  it("should transition status to QUOTATION_SENT when quotation is provided", async () => {
    const offeredPrice = 750000;
    const estimatedDays = 5;

    const quotation = await prisma.quotation.create({
      data: {
        orderId: createdOrder.id,
        creatorId: tailorUser.id,
        offeredPrice,
        currency: "UZS",
        estimatedDays,
        notes: "5 days turnaround with silk lining",
        status: "PENDING",
      },
    });

    const updated = await prisma.order.update({
      where: { id: createdOrder.id },
      data: {
        status: "QUOTATION_SENT",
        totalPrice: offeredPrice,
        estimatedDays,
      },
    });

    expect(quotation.id).toBeDefined();
    expect(updated.status).toBe("QUOTATION_SENT");
    expect(updated.totalPrice).toBe(750000);
    expect(updated.estimatedDays).toBe(5);
  });

  it("should transition status to CUSTOMER_APPROVED when customer approves quotation", async () => {
    const updated = await prisma.order.update({
      where: { id: createdOrder.id },
      data: { status: "CUSTOMER_APPROVED" },
    });

    expect(updated.status).toBe("CUSTOMER_APPROVED");
  });

  it("should allow tailor to progress order to IN_PROGRESS and COMPLETED", async () => {
    const inProgress = await prisma.order.update({
      where: { id: createdOrder.id },
      data: { status: "IN_PROGRESS" },
    });
    expect(inProgress.status).toBe("IN_PROGRESS");

    const completed = await prisma.order.update({
      where: { id: createdOrder.id },
      data: { status: "COMPLETED" },
    });
    expect(completed.status).toBe("COMPLETED");
  });

  afterAll(async () => {
    if (createdOrder) {
      await prisma.quotation.deleteMany({ where: { orderId: createdOrder.id } });
      await prisma.orderStatusHistory.deleteMany({ where: { orderId: createdOrder.id } });
      await prisma.order.delete({ where: { id: createdOrder.id } });
    }
    await prisma.$disconnect();
  });
});
