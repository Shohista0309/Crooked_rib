import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateFashionDesign } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const aiDesignSchema = z.object({
  category: z.string().min(1, "Category is required"),
  genderCategory: z.string().optional(),
  style: z.string().min(1, "Style is required"),
  season: z.string().optional(),
  colors: z.string().min(1, "Colors are required"),
  occasion: z.string().optional(),
  budget: z.number().optional(),
  fabricPreferences: z.string().optional(),
  description: z.string().min(3, "Description is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = aiDesignSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const input = result.data;

    // 1. Query real available inventory from Seller database for Smart Material Recommendations
    const matchedProducts = await prisma.product.findMany({
      where: {
        isAvailable: true,
        isPublished: true,
      },
      include: {
        sellerProfile: {
          select: {
            shopName: true,
            city: true,
            region: true,
            userId: true,
          },
        },
      },
      take: 6,
    });

    // Score / rank matching products based on colors and category
    const rankedProducts = matchedProducts.map((p) => {
      let score = 0;
      if (input.colors && p.color.toLowerCase().includes(input.colors.toLowerCase())) score += 2;
      if (input.fabricPreferences && p.material.toLowerCase().includes(input.fabricPreferences.toLowerCase())) score += 3;
      if (p.category === "FABRIC") score += 1;
      return { ...p, matchScore: score };
    }).sort((a, b) => b.matchScore - a.matchScore);

    // 2. Call external AI service
    const aiResult = await generateFashionDesign(input);

    return NextResponse.json({
      ...aiResult,
      matchedMaterials: rankedProducts,
    });
  } catch (error: any) {
    console.error("AI design endpoint error:", error);
    return NextResponse.json(
      { error: "Failed to process AI design request" },
      { status: 500 }
    );
  }
}
