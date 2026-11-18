import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const design = await prisma.design.findUnique({
      where: { id: params.id },
    });

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    // Customer can view their own design, or creator can view design if attached to an order assigned to them
    if (design.userId !== auth.user.id && auth.user.role !== "ADMIN") {
      const orderWithCreator = await prisma.order.findFirst({
        where: {
          designId: design.id,
          creatorId: auth.user.id,
        },
      });

      if (!orderWithCreator) {
        return NextResponse.json({ error: "Forbidden: Not your design" }, { status: 403 });
      }
    }

    return NextResponse.json({ design });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch design" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const design = await prisma.design.findUnique({
      where: { id: params.id },
    });

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    if (design.userId !== auth.user.id && auth.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Not your design" }, { status: 403 });
    }

    await prisma.design.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Design deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete design" }, { status: 500 });
  }
}
