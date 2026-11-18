import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const productUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  category: z.enum(["FABRIC", "THREAD", "BUTTONS", "ZIPPERS", "ACCESSORIES", "TRIM"]).optional(),
  material: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  currency: z.string().optional(),
  quantity: z.number().int().nonnegative().optional(),
  unit: z.string().optional(),
  region: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  imageUrl: z.string().min(1).optional(),
  isAvailable: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        sellerProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(req, ["SELLER", "ADMIN"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { sellerProfile: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Security check: Only the seller who owns the product (or Admin) can update it!
    if (auth.user.role !== "ADMIN" && product.sellerProfile.userId !== auth.user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this product" }, { status: 403 });
    }

    const body = await req.json();
    const result = productUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: result.data,
    });

    return NextResponse.json({ product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(req, ["SELLER", "ADMIN"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { sellerProfile: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Security check: Only the owner can delete
    if (auth.user.role !== "ADMIN" && product.sellerProfile.userId !== auth.user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this product" }, { status: 403 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
