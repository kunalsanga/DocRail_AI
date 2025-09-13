import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/storage";
import { Annotation } from "@/lib/types";

const FILE = "annotations.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get("documentId") || undefined;
  const all = await readJson<Annotation[]>(FILE, []);
  const filtered = documentId ? all.filter(a => a.documentId === documentId) : all;
  const res = NextResponse.json({ annotations: filtered });
  res.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
  return res;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Annotation>;
  const now = new Date().toISOString();
  const toCreate: Annotation = {
    id: body.id || `ann_${Math.random().toString(36).slice(2)}`,
    documentId: body.documentId || "",
    author: body.author as Annotation["author"],
    target: body.target || { type: "summary" },
    content: body.content || "",
    tags: body.tags || [],
    createdAt: now,
    updatedAt: now,
  };

  const all = await readJson<Annotation[]>(FILE, []);
  all.push(toCreate);
  await writeJson(FILE, all);
  return NextResponse.json({ annotation: toCreate }, { status: 201 });
}


