import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const [
      totalCreators,
      activeCreators,
      totalOrders,
      activeOrders,
      completedOrders,
      totalSellers,
      totalProducts,
      ordersWithPrices,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "CREATOR" } }),
      prisma.creatorProfile.count({ where: { isAvailable: true } }),
      prisma.order.count(),
      prisma.order.count({
        where: {
          status: { in: ["REQUEST_SUBMITTED", "UNDER_REVIEW", "QUOTATION_SENT", "CUSTOMER_APPROVED", "IN_PROGRESS"] },
        },
      }),
      prisma.order.count({ where: { status: "COMPLETED" } }),
      prisma.user.count({ where: { role: "SELLER" } }),
      prisma.product.count({ where: { isPublished: true } }),
      prisma.order.findMany({
        where: {
          status: { in: ["CUSTOMER_APPROVED", "IN_PROGRESS", "READY", "COMPLETED"] },
          totalPrice: { not: null },
        },
        select: { totalPrice: true },
      }),
    ]);

    const grossOrderVolume = ordersWithPrices.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

    return NextResponse.json({
      metrics: {
        totalCreators,
        activeCreators,
        totalOrders,
        activeOrders,
        completedOrders,
        totalSellers,
        totalProducts,
        grossOrderVolume,
        currency: "UZS",
      },
      verified: true,
      lastUpdated: new Date().toISOString(),
      disclaimer:
        "All metrics are generated from live database records. Gross order volume reflects confirmed platform commissions/orders and should not be confused with individual tailor net earnings.",
    });
  } catch (error: any) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Failed to generate analytics" }, { status: 500 });
  }
}
