import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const sendMessageSchema = z.object({
  receiverId: z.string().min(1, "Receiver ID is required"),
  orderId: z.string().optional(),
  content: z.string().min(1, "Message content cannot be empty"),
});

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const otherUserId = searchParams.get("userId");

    let where: any = {
      OR: [
        { senderId: auth.user.id },
        { receiverId: auth.user.id },
      ],
    };

    if (orderId) {
      where.orderId = orderId;
    }

    if (otherUserId) {
      where = {
        OR: [
          { senderId: auth.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: auth.user.id },
        ],
      };
      if (orderId) where.orderId = orderId;
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: { select: { id: true, name: true, role: true, avatar: true } },
        receiver: { select: { id: true, name: true, role: true, avatar: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error("Messages GET error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const result = sendMessageSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { receiverId, orderId, content } = result.data;

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return NextResponse.json({ error: "Recipient user not found" }, { status: 404 });
    }

    const message = await prisma.$transaction(async (tx) => {
      const msg = await tx.message.create({
        data: {
          senderId: auth.user.id,
          receiverId,
          orderId: orderId || null,
          content,
        },
        include: {
          sender: { select: { id: true, name: true, role: true } },
          receiver: { select: { id: true, name: true, role: true } },
        },
      });

      await tx.notification.create({
        data: {
          userId: receiverId,
          title: `Yangi xabar: ${auth.user.name}`,
          message: content.length > 60 ? `${content.slice(0, 60)}...` : content,
          type: "NEW_MESSAGE",
          link: orderId ? `/dashboard/${receiver.role.toLowerCase()}/orders/${orderId}` : `/dashboard/${receiver.role.toLowerCase()}/messages`,
        },
      });

      return msg;
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error: any) {
    console.error("Message send error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
