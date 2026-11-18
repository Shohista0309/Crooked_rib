import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const createOrderSchema = z.object({
  creatorId: z.string().min(1, "Tailor ID is required"),
  designId: z.string().optional(),
  customerNotes: z.string().min(2, "Notes or description are required"),
  measurements: z.string().optional(),
  deliveryAddress: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    let where: any = {};
    if (auth.user.role === "CUSTOMER") {
      where.customerId = auth.user.id;
    } else if (auth.user.role === "CREATOR") {
      where.creatorId = auth.user.id;
    } else if (auth.user.role !== "ADMIN") {
      return NextResponse.json({ orders: [] });
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        creator: {
          select: {
            id: true,
            name: true,
            creatorProfile: { select: { workshopName: true, city: true } },
          },
        },
        design: { select: { id: true, title: true, category: true, style: true } },
        quotations: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ["CUSTOMER", "ADMIN"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const result = createOrderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { creatorId, designId, customerNotes, measurements, deliveryAddress } = result.data;

    // Verify creator exists
    const creator = await prisma.user.findFirst({
      where: { id: creatorId, role: "CREATOR" },
    });

    if (!creator) {
      return NextResponse.json({ error: "Tailor not found" }, { status: 404 });
    }

    // Generate unique order number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `CR-${new Date().getFullYear()}-${randomSuffix}`;

    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: auth.user.id,
          creatorId,
          designId: designId || null,
          status: "REQUEST_SUBMITTED",
          customerNotes,
          measurements,
          deliveryAddress,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: "REQUEST_SUBMITTED",
          note: "Order request created by customer",
          updatedById: auth.user.id,
        },
      });

      await tx.notification.create({
        data: {
          userId: creatorId,
          title: "Yangi buyurtma so'rovi",
          message: `${auth.user.name} sizga yangi kiyim tikish so'rovini yubordi (${orderNumber}).`,
          type: "ORDER_REQUEST",
          link: `/dashboard/creator/orders/${order.id}`,
        },
      });

      return order;
    });

    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("Order create error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
