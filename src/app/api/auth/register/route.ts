import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, signSessionToken, COOKIE_NAME } from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(["CUSTOMER", "CREATOR", "SELLER"]),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms of service" }),
  }),
  // Optional profile fields upon registration
  city: z.string().optional(),
  region: z.string().optional(),
  phone: z.string().optional(),
  workshopName: z.string().optional(),
  shopName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { name, email, password, role, city, region, phone, workshopName, shopName } = result.data;

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create user and profile in a transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase().trim(),
          passwordHash,
          role,
          phone,
          isVerified: false,
        },
      });

      if (role === "CUSTOMER") {
        await tx.customerProfile.create({
          data: {
            userId: user.id,
            city: city || "Toshkent",
            region: region || "Toshkent shahri",
          },
        });
      } else if (role === "CREATOR") {
        await tx.creatorProfile.create({
          data: {
            userId: user.id,
            workshopName: workshopName || name,
            region: region || "Toshkent shahri",
            city: city || "Toshkent",
            specialties: "Ayollar va bolalar liboslari, milliy va zamonaviy uslub",
            startingPrice: 200000,
            currency: "UZS",
            experienceYears: 1,
            isAvailable: true,
          },
        });
      } else if (role === "SELLER") {
        await tx.sellerProfile.create({
          data: {
            userId: user.id,
            shopName: shopName || `${name} Do'koni`,
            region: region || "Toshkent shahri",
            city: city || "Toshkent",
            phone,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: "USER_REGISTERED",
          resource: "User",
          details: `Role: ${role}`,
        },
      });

      return user;
    });

    const token = await signSessionToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as any,
    });

    const response = NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    );
  }
}
