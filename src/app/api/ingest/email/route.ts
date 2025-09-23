import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Stub: parse email payload and return normalized document entries
  const body = await req.json().catch(() => ({}));
  return NextResponse.json(
    {
      source: "email",
      received: true,
      items: [
        {
          id: `email_${Math.random().toString(36).slice(2)}`,
          title: body.subject || "Email Attachment",
          language: body.language || "en",
          receivedAt: new Date().toISOString(),
        },
      ],
    },
    { status: 200 }
  );
}


