import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const portfolioSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().min(1, "Image URL is required"),
  category: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ["CREATOR", "ADMIN"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const profile = await prisma.creatorProfile.findUnique({
      where: { userId: auth.user.id },
      include: { portfolios: { orderBy: { createdAt: "desc" } } },
    });

    if (!profile) {
      return NextResponse.json({ error: "Creator profile not found" }, { status: 404 });
    }

    return NextResponse.json({ portfolios: profile.portfolios });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ["CREATOR"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const result = portfolioSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const profile = await prisma.creatorProfile.findUnique({
      where: { userId: auth.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Creator profile not found" }, { status: 404 });
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        creatorProfileId: profile.id,
        ...result.data,
      },
    });

    return NextResponse.json({ portfolio }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to add portfolio item" }, { status: 500 });
  }
}
