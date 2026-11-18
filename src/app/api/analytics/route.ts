import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
    return NextResponse.json({
      metrics: {
        totalCreators: 0,
        activeCreators: 0,
        totalOrders: 0,
        activeOrders: 0,
        completedOrders: 0,
        totalSellers: 0,
        totalProducts: 0,
        grossOrderVolume: 0,
        currency: "UZS",
      },
      verified: false,
      error: "Failed to generate analytics",
    }, { status: 200 }); // Return 200 with zero metrics fallback so build/page never breaks if DB is offline
  }
}
