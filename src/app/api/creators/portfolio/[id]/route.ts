import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(req, ["CREATOR", "ADMIN"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: params.id },
      include: { creatorProfile: true },
    });

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
    }

    if (auth.user.role !== "ADMIN" && portfolio.creatorProfile.userId !== auth.user.id) {
      return NextResponse.json({ error: "Forbidden: Not your portfolio" }, { status: 403 });
    }

    await prisma.portfolio.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Portfolio item deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 });
  }
}
