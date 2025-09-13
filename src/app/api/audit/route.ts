import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/storage";
import { AuditLog } from "@/lib/types";

const FILE = "audit.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get("documentId") || undefined;
  const all = await readJson<AuditLog[]>(FILE, []);
  const filtered = documentId ? all.filter(a => a.documentId === documentId) : all;
  const res = NextResponse.json({ logs: filtered });
  res.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
  return res;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<AuditLog>;
  const now = new Date().toISOString();
  const created: AuditLog = {
    id: body.id || `aud_${Math.random().toString(36).slice(2)}`,
    documentId: body.documentId,
    actor: body.actor as AuditLog["actor"],
    action: body.action || "upload",
    details: body.details || {},
    createdAt: now,
  };
  const all = await readJson<AuditLog[]>(FILE, []);
  all.push(created);
  await writeJson(FILE, all);
  return NextResponse.json({ log: created }, { status: 201 });
}


