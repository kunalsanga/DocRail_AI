import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json(
    {
      source: "maximo",
      received: true,
      items: [
        {
          id: `mx_${Math.random().toString(36).slice(2)}`,
          workOrder: body.workOrder || "WO-12345",
          language: body.language || "en",
          receivedAt: new Date().toISOString(),
        },
      ],
    },
    { status: 200 }
  );
}


