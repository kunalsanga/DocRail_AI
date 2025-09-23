import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json(
    {
      source: "sharepoint",
      received: true,
      items: [
        {
          id: `sp_${Math.random().toString(36).slice(2)}`,
          path: body.path || "/sites/kmrl/docs/sample.pdf",
          language: body.language || "en",
          receivedAt: new Date().toISOString(),
        },
      ],
    },
    { status: 200 }
  );
}


