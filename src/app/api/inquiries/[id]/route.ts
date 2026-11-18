import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const replySchema = z.object({
  reply: z.string().min(1, "Reply cannot be empty"),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(req, ["SELLER", "ADMIN"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const inquiry = await prisma.productInquiry.findUnique({
      where: { id: params.id },
      include: { product: true },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    if (inquiry.sellerId !== auth.user.id && auth.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Not your inquiry" }, { status: 403 });
    }

    const body = await req.json();
    const result = replySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0]?.message }, { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const inq = await tx.productInquiry.update({
        where: { id: inquiry.id },
        data: { reply: result.data.reply },
      });

      await tx.notification.create({
        data: {
          userId: inquiry.senderId,
          title: "Sotuvchi so'rovingizga javob berdi",
          message: `Sotuvchi "${inquiry.product.name}" mahsuloti bo'yicha so'rovingizga javob berdi: ${result.data.reply}`,
          type: "INQUIRY_REPLY",
          link: `/marketplace/${inquiry.productId}`,
        },
      });

      return inq;
    });

    return NextResponse.json({ inquiry: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to reply to inquiry" }, { status: 500 });
  }
}
