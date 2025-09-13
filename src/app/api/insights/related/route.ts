import { NextRequest, NextResponse } from "next/server";
import { readJson } from "@/lib/storage";
import { Annotation, DocumentVersion } from "@/lib/types";

const ANN = "annotations.json";
const VER = "versions.json";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { documentId: string; text?: string };
  const [annotations, versions] = await Promise.all([
    readJson<Annotation[]>(ANN, []),
    readJson<DocumentVersion[]>(VER, []),
  ]);

  // Simple heuristic: find documents sharing tags or similar titles substrings.
  const currentDocVersions = versions.filter(v => v.documentId === body.documentId);
  const titleTokens = new Set(
    (currentDocVersions[0]?.summary || "")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
  );

  const tagMap = new Map<string, Set<string>>();
  for (const ann of annotations) {
    const tagSet = new Set((ann.tags || []).map(t => t.toLowerCase()));
    const existing = tagMap.get(ann.documentId) || new Set<string>();
    for (const t of tagSet) existing.add(t);
    tagMap.set(ann.documentId, existing);
  }

  const baseTags = tagMap.get(body.documentId) || new Set<string>();

  const scores: { documentId: string; score: number }[] = [];
  for (const [docId, tags] of tagMap) {
    if (docId === body.documentId) continue;
    let score = 0;
    // tag overlap
    for (const t of tags) if (baseTags.has(t)) score += 2;
    // title token overlap via summaries
    const otherSummary = versions.find(v => v.documentId === docId)?.summary || "";
    const tokens = new Set(
      otherSummary
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean)
    );
    for (const tk of tokens) if (titleTokens.has(tk)) score += 1;
    if (score > 0) scores.push({ documentId: docId, score });
  }

  scores.sort((a, b) => b.score - a.score);
  const related = scores.slice(0, 10);
  return NextResponse.json({ related });
}


