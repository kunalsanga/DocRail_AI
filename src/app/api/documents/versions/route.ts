import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/storage";
import { DocumentVersion, UserRef } from "@/lib/types";

const FILE = "versions.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get("documentId") || undefined;
  const all = await readJson<DocumentVersion[]>(FILE, []);
  const filtered = documentId ? all.filter(v => v.documentId === documentId) : all;
  const res = NextResponse.json({ versions: filtered });
  res.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
  return res;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<DocumentVersion> & {
    documentId: string;
    createdBy: UserRef;
  };
  const existing = await readJson<DocumentVersion[]>(FILE, []);
  const currentMax = Math.max(0, ...existing.filter(v => v.documentId === body.documentId).map(v => v.version));
  const version = currentMax + 1;
  const now = new Date().toISOString();
  const created: DocumentVersion = {
    id: body.id || `ver_${Math.random().toString(36).slice(2)}`,
    documentId: body.documentId,
    version,
    filePath: body.filePath,
    summary: body.summary,
    createdAt: now,
    createdBy: body.createdBy,
    changeNote: body.changeNote,
  };
  existing.push(created);
  await writeJson(FILE, existing);
  return NextResponse.json({ version: created }, { status: 201 });
}


