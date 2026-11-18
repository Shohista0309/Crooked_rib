import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const region = searchParams.get("region");
    const city = searchParams.get("city");
    const maxPrice = searchParams.get("maxPrice");

    const where: any = {
      role: "CREATOR",
      creatorProfile: {
        isNot: null,
      },
    };

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        avatar: true,
        phone: true,
        creatorProfile: {
          include: {
            portfolios: {
              take: 3,
            },
          },
        },
      },
    });

    // In-memory / relational filtering for text matching
    let results = users.map((u) => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      workshopName: u.creatorProfile?.workshopName || u.name,
      region: u.creatorProfile?.region || "O'zbekiston",
      city: u.creatorProfile?.city || "",
      specialties: u.creatorProfile?.specialties || "",
      experienceYears: u.creatorProfile?.experienceYears || 1,
      startingPrice: u.creatorProfile?.startingPrice || 0,
      currency: u.creatorProfile?.currency || "UZS",
      bio: u.creatorProfile?.bio || "",
      isAvailable: u.creatorProfile?.isAvailable ?? true,
      portfolios: u.creatorProfile?.portfolios || [],
    }));

    if (search) {
      results = results.filter(
        (t) =>
          t.name.toLowerCase().includes(search) ||
          t.workshopName.toLowerCase().includes(search) ||
          t.specialties.toLowerCase().includes(search) ||
          t.city.toLowerCase().includes(search)
      );
    }

    if (region && region !== "all") {
      results = results.filter((t) => t.region.toLowerCase().includes(region.toLowerCase()));
    }

    if (city) {
      results = results.filter((t) => t.city.toLowerCase().includes(city.toLowerCase()));
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        results = results.filter((t) => t.startingPrice <= max);
      }
    }

    return NextResponse.json({ tailors: results });
  } catch (error: any) {
    console.error("Tailors fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch tailors" }, { status: 500 });
  }
}
