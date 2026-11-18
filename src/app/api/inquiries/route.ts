import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const inquiryCreateSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  message: z.string().min(2, "Message cannot be empty"),
});

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    let where: any = {};
    if (auth.user.role === "SELLER") {
      where.sellerId = auth.user.id;
    } else {
      where.senderId = auth.user.id;
    }

    const inquiries = await prisma.productInquiry.findMany({
      where,
      include: {
        product: { select: { id: true, name: true, price: true, currency: true, imageUrl: true } },
        sender: { select: { id: true, name: true, email: true, phone: true } },
        seller: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ inquiries });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const result = inquiryCreateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: result.data.productId },
      include: { sellerProfile: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const inquiry = await prisma.$transaction(async (tx) => {
      const inq = await tx.productInquiry.create({
        data: {
          productId: product.id,
          senderId: auth.user.id,
          sellerId: product.sellerProfile.userId,
          message: result.data.message,
        },
      });

      await tx.notification.create({
        data: {
          userId: product.sellerProfile.userId,
          title: "Mahsulot bo'yicha yangi so'rov",
          message: `${auth.user.name} sizning "${product.name}" mahsulotingiz bo'yicha so'rov yubordi.`,
          type: "NEW_MESSAGE",
          link: `/dashboard/seller/inquiries`,
        },
      });

      return inq;
    });

    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (error: any) {
    console.error("Inquiry error:", error);
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 });
  }
}
