import { NextRequest, NextResponse } from "next/server";
import { readJson } from "@/lib/storage";
import { Annotation, KnowledgeGraphNode } from "@/lib/types";

const ANN_FILE = "annotations.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("query") || "").toLowerCase();
  const type = searchParams.get("type") || "all"; // document | department | category | all

  const annotations = await readJson<Annotation[]>(ANN_FILE, []);

  const nodesMap = new Map<string, KnowledgeGraphNode>();

  function ensureNode(id: string, label: string, type: KnowledgeGraphNode["type"]) {
    if (!nodesMap.has(id)) nodesMap.set(id, { id, label, type });
  }

  for (const ann of annotations) {
    const docNodeId = `doc:${ann.documentId}`;
    ensureNode(docNodeId, ann.documentId, "document");

    for (const tag of ann.tags || []) {
      if (tag.startsWith("@")) {
        const dept = tag.slice(1);
        ensureNode(`dept:${dept}`, dept, "department");
      } else if (tag.startsWith("#")) {
        const cat = tag.slice(1);
        ensureNode(`cat:${cat}`, cat, "category");
      }
    }
  }

  let results = Array.from(nodesMap.values());
  if (type !== "all") {
    results = results.filter((n) => n.type === (type as KnowledgeGraphNode["type"]));
  }
  if (query) {
    results = results.filter((n) => n.label.toLowerCase().includes(query));
  }

  const res = NextResponse.json({ nodes: results.slice(0, 200) });
  res.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
  return res;
}


