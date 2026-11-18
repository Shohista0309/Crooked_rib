import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const productCreateSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().min(5, "Description is required"),
  category: z.enum(["FABRIC", "THREAD", "BUTTONS", "ZIPPERS", "ACCESSORIES", "TRIM"]),
  material: z.string().min(1, "Material specification is required"),
  color: z.string().min(1, "Color is required"),
  price: z.number().positive("Price must be greater than zero"),
  currency: z.string().default("UZS"),
  quantity: z.number().int().nonnegative("Quantity cannot be negative"),
  unit: z.string().default("meter"),
  region: z.string().min(1, "Region is required"),
  city: z.string().min(1, "City is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  isAvailable: z.boolean().default(true),
  isPublished: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const category = searchParams.get("category");
    const material = searchParams.get("material")?.toLowerCase();
    const color = searchParams.get("color")?.toLowerCase();
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const region = searchParams.get("region");
    const sellerId = searchParams.get("sellerId");

    const where: any = {
      isPublished: true,
    };

    if (category && category !== "ALL") {
      where.category = category;
    }

    if (sellerId) {
      where.sellerProfile = { userId: sellerId };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        sellerProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let filtered = products;

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.material.toLowerCase().includes(search) ||
          p.color.toLowerCase().includes(search) ||
          p.city.toLowerCase().includes(search)
      );
    }

    if (material) {
      filtered = filtered.filter((p) => p.material.toLowerCase().includes(material));
    }

    if (color) {
      filtered = filtered.filter((p) => p.color.toLowerCase().includes(color));
    }

    if (region && region !== "all") {
      filtered = filtered.filter((p) => p.region.toLowerCase().includes(region.toLowerCase()));
    }

    return NextResponse.json({ products: filtered });
  } catch (error: any) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ["SELLER"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const result = productCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    // Get seller profile
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: auth.user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: "Seller profile not found" }, { status: 404 });
    }

    const product = await prisma.product.create({
      data: {
        sellerProfileId: sellerProfile.id,
        ...result.data,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error("Product create error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
