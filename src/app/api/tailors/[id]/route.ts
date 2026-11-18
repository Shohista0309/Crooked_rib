import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: params.id,
        role: "CREATOR",
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        phone: true,
        createdAt: true,
        creatorProfile: {
          include: {
            portfolios: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (!user || !user.creatorProfile) {
      return NextResponse.json({ error: "Tailor not found" }, { status: 404 });
    }

    return NextResponse.json({
      tailor: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        phone: user.phone,
        memberSince: user.createdAt,
        workshopName: user.creatorProfile.workshopName || user.name,
        region: user.creatorProfile.region,
        city: user.creatorProfile.city,
        specialties: user.creatorProfile.specialties,
        experienceYears: user.creatorProfile.experienceYears,
        startingPrice: user.creatorProfile.startingPrice,
        currency: user.creatorProfile.currency,
        bio: user.creatorProfile.bio,
        isAvailable: user.creatorProfile.isAvailable,
        portfolios: user.creatorProfile.portfolios,
      },
    });
  } catch (error: any) {
    console.error("Tailor detail fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch tailor profile" }, { status: 500 });
  }
}
