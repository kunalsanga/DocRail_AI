import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json(
    {
      source: "whatsapp",
      received: true,
      items: [
        {
          id: `wa_${Math.random().toString(36).slice(2)}`,
          from: body.from || "+91XXXXXXXXXX",
          language: body.language || "ml",
          receivedAt: new Date().toISOString(),
        },
      ],
    },
    { status: 200 }
  );
}


