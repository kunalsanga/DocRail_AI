import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/storage";
import { AuditLog } from "@/lib/types";

const FILE = "audit.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get("documentId") || undefined;
  const format = (searchParams.get("format") || "json").toLowerCase();
  const all = await readJson<AuditLog[]>(FILE, []);
  const filtered = documentId ? all.filter(a => a.documentId === documentId) : all;
  if (format === "csv") {
    const headers = ["id","documentId","actor.id","actor.name","actor.email","actor.role","actor.department","action","createdAt"];
    const toCsv = (v: unknown) => (v === undefined || v === null ? "" : String(v).replaceAll('"', '""'));
    const lines = [headers.join(",")].concat(
      filtered.map(l => [
        l.id,
        l.documentId || "",
        l.actor?.id || "",
        l.actor?.name || "",
        l.actor?.email || "",
        l.actor?.role || "",
        l.actor?.department || "",
        l.action,
        l.createdAt,
      ].map(v => `"${toCsv(v)}"`).join(","))
    );
    return new NextResponse(lines.join("\n"), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=120",
      },
    });
  }
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


