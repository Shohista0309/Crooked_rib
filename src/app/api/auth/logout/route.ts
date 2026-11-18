import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ message: "Logged out successfully" });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
