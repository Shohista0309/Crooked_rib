import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      include: {
        customerProfile: true,
        creatorProfile: true,
        sellerProfile: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { name, phone, avatar, bio, city, region, workshopName, specialties, startingPrice, isAvailable, shopName, address } = body;

    // Update common user fields
    await prisma.user.update({
      where: { id: auth.user.id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(avatar !== undefined && { avatar }),
      },
    });

    // Update specific role profile
    if (auth.user.role === "CUSTOMER") {
      await prisma.customerProfile.upsert({
        where: { userId: auth.user.id },
        update: {
          ...(bio !== undefined && { bio }),
          ...(city !== undefined && { city }),
          ...(region !== undefined && { region }),
        },
        create: {
          userId: auth.user.id,
          bio,
          city,
          region,
        },
      });
    } else if (auth.user.role === "CREATOR") {
      await prisma.creatorProfile.upsert({
        where: { userId: auth.user.id },
        update: {
          ...(workshopName !== undefined && { workshopName }),
          ...(bio !== undefined && { bio }),
          ...(city !== undefined && { city }),
          ...(region !== undefined && { region }),
          ...(specialties !== undefined && { specialties }),
          ...(startingPrice !== undefined && { startingPrice: parseFloat(startingPrice) || 0 }),
          ...(isAvailable !== undefined && { isAvailable }),
        },
        create: {
          userId: auth.user.id,
          workshopName: workshopName || name,
          city: city || "Toshkent",
          region: region || "Toshkent shahri",
          specialties: specialties || "",
          startingPrice: parseFloat(startingPrice) || 0,
          isAvailable: isAvailable ?? true,
          bio,
        },
      });
    } else if (auth.user.role === "SELLER") {
      await prisma.sellerProfile.upsert({
        where: { userId: auth.user.id },
        update: {
          ...(shopName !== undefined && { shopName }),
          ...(address !== undefined && { address }),
          ...(city !== undefined && { city }),
          ...(region !== undefined && { region }),
          ...(phone !== undefined && { phone }),
        },
        create: {
          userId: auth.user.id,
          shopName: shopName || `${name} Do'koni`,
          city: city || "Toshkent",
          region: region || "Toshkent shahri",
          address,
          phone,
        },
      });
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
