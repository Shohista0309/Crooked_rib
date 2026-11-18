import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const designSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1),
  genderCategory: z.string().default("WOMEN"),
  style: z.string().min(1),
  season: z.string().default("ALL_SEASON"),
  colors: z.string().min(1),
  occasion: z.string().optional(),
  budget: z.number().optional(),
  fabricPreferences: z.string().optional(),
  conceptDescription: z.string().min(1),
  recommendedFabrics: z.string().optional(),
  recommendedAccessories: z.string().optional(),
  technicalNotes: z.string().optional(),
  sketchUrl: z.string().optional(),
  aiGenerated: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const designs = await prisma.design.findMany({
      where: { userId: auth.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ designs });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch designs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const result = designSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const design = await prisma.design.create({
      data: {
        userId: auth.user.id,
        ...result.data,
      },
    });

    return NextResponse.json({ design }, { status: 201 });
  } catch (error: any) {
    console.error("Design save error:", error);
    return NextResponse.json({ error: "Failed to save design" }, { status: 500 });
  }
}
