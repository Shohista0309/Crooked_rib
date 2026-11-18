import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const patchOrderSchema = z.object({
  action: z.enum(["SEND_QUOTE", "APPROVE_QUOTE", "REJECT_QUOTE", "UPDATE_STATUS"]),
  offeredPrice: z.number().positive().optional(),
  estimatedDays: z.number().int().positive().optional(),
  notes: z.string().optional(),
  status: z.enum([
    "REQUEST_SUBMITTED",
    "UNDER_REVIEW",
    "QUOTATION_SENT",
    "CUSTOMER_APPROVED",
    "IN_PROGRESS",
    "READY",
    "COMPLETED",
    "CANCELLED",
  ]).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        creator: {
          select: {
            id: true,
            name: true,
            phone: true,
            creatorProfile: {
              select: {
                workshopName: true,
                region: true,
                city: true,
                specialties: true,
              },
            },
          },
        },
        design: true,
        quotations: { orderBy: { createdAt: "desc" } },
        statusHistory: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Authorization check: Only buyer, assigned creator, or Admin can view
    if (
      auth.user.role !== "ADMIN" &&
      order.customerId !== auth.user.id &&
      order.creatorId !== auth.user.id
    ) {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to view this order" },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Order detail error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const body = await req.json();
    const result = patchOrderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { action, offeredPrice, estimatedDays, notes, status } = result.data;

    // 1. Creator sends quotation
    if (action === "SEND_QUOTE") {
      if (order.creatorId !== auth.user.id && auth.user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Forbidden: Only the assigned tailor can quote this order" },
          { status: 403 }
        );
      }

      if (!offeredPrice || !estimatedDays) {
        return NextResponse.json(
          { error: "Price and estimated days are required for a quotation" },
          { status: 400 }
        );
      }

      const updated = await prisma.$transaction(async (tx) => {
        await tx.quotation.create({
          data: {
            orderId: order.id,
            creatorId: auth.user.id,
            offeredPrice,
            currency: "UZS",
            estimatedDays,
            notes,
            status: "PENDING",
          },
        });

        const updatedOrder = await tx.order.update({
          where: { id: order.id },
          data: {
            status: "QUOTATION_SENT",
            totalPrice: offeredPrice,
            estimatedDays,
          },
        });

        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: "QUOTATION_SENT",
            note: `Quotation sent: ${offeredPrice} UZS, ${estimatedDays} days. ${notes || ""}`,
            updatedById: auth.user.id,
          },
        });

        await tx.notification.create({
          data: {
            userId: order.customerId,
            title: "Yangi narx taklifi olindi",
            message: `Buyurtmangiz (${order.orderNumber}) uchun ${offeredPrice} so'm narx va ${estimatedDays} kun muddat taklif qilindi.`,
            type: "QUOTATION_RECEIVED",
            link: `/dashboard/customer/orders/${order.id}`,
          },
        });

        return updatedOrder;
      });

      return NextResponse.json({ order: updated });
    }

    // 2. Customer approves quotation
    if (action === "APPROVE_QUOTE") {
      if (order.customerId !== auth.user.id && auth.user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Forbidden: Only the customer can approve this quotation" },
          { status: 403 }
        );
      }

      const updated = await prisma.$transaction(async (tx) => {
        // Mark quotation as accepted
        const latestQuote = await tx.quotation.findFirst({
          where: { orderId: order.id },
          orderBy: { createdAt: "desc" },
        });

        if (latestQuote) {
          await tx.quotation.update({
            where: { id: latestQuote.id },
            data: { status: "ACCEPTED" },
          });
        }

        const updatedOrder = await tx.order.update({
          where: { id: order.id },
          data: { status: "CUSTOMER_APPROVED" },
        });

        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: "CUSTOMER_APPROVED",
            note: "Customer approved the quotation.",
            updatedById: auth.user.id,
          },
        });

        await tx.notification.create({
          data: {
            userId: order.creatorId,
            title: "Buyurtma tasdiqlandi!",
            message: `Mijoz ${order.orderNumber} raqamli buyurtma taklifingizni tasdiqladi. Tikishni boshlashingiz mumkin.`,
            type: "ORDER_STATUS_CHANGED",
            link: `/dashboard/creator/orders/${order.id}`,
          },
        });

        return updatedOrder;
      });

      return NextResponse.json({ order: updated });
    }

    // 3. Customer rejects quotation
    if (action === "REJECT_QUOTE") {
      if (order.customerId !== auth.user.id && auth.user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Forbidden: Only the customer can reject this quotation" },
          { status: 403 }
        );
      }

      const updated = await prisma.$transaction(async (tx) => {
        const latestQuote = await tx.quotation.findFirst({
          where: { orderId: order.id },
          orderBy: { createdAt: "desc" },
        });

        if (latestQuote) {
          await tx.quotation.update({
            where: { id: latestQuote.id },
            data: { status: "REJECTED" },
          });
        }

        const updatedOrder = await tx.order.update({
          where: { id: order.id },
          data: { status: "CANCELLED" },
        });

        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: "CANCELLED",
            note: "Customer declined quotation and cancelled request.",
            updatedById: auth.user.id,
          },
        });

        return updatedOrder;
      });

      return NextResponse.json({ order: updated });
    }

    // 4. Creator updates execution status (IN_PROGRESS, READY, COMPLETED, CANCELLED)
    if (action === "UPDATE_STATUS") {
      if (order.creatorId !== auth.user.id && auth.user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Forbidden: Only the assigned tailor can update order status" },
          { status: 403 }
        );
      }

      if (!status) {
        return NextResponse.json({ error: "Target status is required" }, { status: 400 });
      }

      const updated = await prisma.$transaction(async (tx) => {
        const updatedOrder = await tx.order.update({
          where: { id: order.id },
          data: { status },
        });

        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status,
            note: notes || `Status updated to ${status}`,
            updatedById: auth.user.id,
          },
        });

        await tx.notification.create({
          data: {
            userId: order.customerId,
            title: "Buyurtma holati yangilandi",
            message: `Buyurtmangiz (${order.orderNumber}) yangi holatga o'tdi: ${status}`,
            type: "ORDER_STATUS_CHANGED",
            link: `/dashboard/customer/orders/${order.id}`,
          },
        });

        return updatedOrder;
      });

      return NextResponse.json({ order: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Order patch error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
