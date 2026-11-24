import { createDecartClient, models } from "@decartai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, ["CUSTOMER"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  return NextResponse.json(
    { configured: Boolean(process.env.DECART_API_KEY?.trim()) },
    { headers: { "Cache-Control": "no-store" } }
  );
}

const tokenRequestSchema = z.object({
  consent: z.literal(true),
  durationSeconds: z.union([
    z.literal(60),
    z.literal(120),
    z.literal(180),
    z.literal(300),
  ]),
}).strict();

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "So‘rov manbasi tasdiqlanmadi." }, { status: 403 });
  }

  const auth = await requireAuth(request, ["CUSTOMER"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "So‘rov ma’lumotlari noto‘g‘ri." }, { status: 400 });
  }

  const parsed = tokenRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Sessiya muddati yoki rozilik noto‘g‘ri." }, { status: 400 });
  }

  const apiKey = process.env.DECART_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Decart xizmati sozlanmagan. DECART_API_KEY server muhitiga qo‘shilishi kerak." },
      { status: 503 }
    );
  }

  try {
    const client = createDecartClient({ apiKey, telemetry: false });
    const model = models.realtime("lucy-vton-3.6");
    const token = await client.tokens.create({
      expiresIn: 60,
      allowedModels: [model.name],
      allowedOrigins: [origin],
      constraints: {
        realtime: { maxSessionDuration: parsed.data.durationSeconds },
      },
    });

    return NextResponse.json(
      { apiKey: token.apiKey, expiresAt: token.expiresAt },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error(
      "Decart client token issuance failed:",
      error instanceof Error ? error.message : "Unknown SDK error"
    );
    return NextResponse.json(
      { error: "Decart sessiyasi yaratilmadi. API kaliti, hisob holati va kreditlarni tekshiring." },
      { status: 502 }
    );
  }
}
