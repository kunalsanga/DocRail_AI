import { NextRequest, NextResponse } from "next/server";
import { readJson } from "@/lib/storage";
import { Annotation, KnowledgeGraph, KnowledgeGraphEdge, KnowledgeGraphNode } from "@/lib/types";

const ANN_FILE = "annotations.json";

export async function GET(_req: NextRequest) {
  const annotations = await readJson<Annotation[]>(ANN_FILE, []);

  const nodesMap = new Map<string, KnowledgeGraphNode>();
  const edges: KnowledgeGraphEdge[] = [];

  function ensureNode(id: string, label: string, type: KnowledgeGraphNode["type"]) {
    if (!nodesMap.has(id)) {
      nodesMap.set(id, { id, label, type });
    }
  }

  for (const ann of annotations) {
    const docNodeId = `doc:${ann.documentId}`;
    ensureNode(docNodeId, ann.documentId, "document");

    for (const tag of ann.tags || []) {
      if (tag.startsWith("@")) {
        const dept = tag.slice(1);
        const deptId = `dept:${dept}`;
        ensureNode(deptId, dept, "department");
        edges.push({
          id: `e_${docNodeId}_${deptId}_${edges.length}`,
          source: docNodeId,
          target: deptId,
          relation: "mentioned_in",
        });
      } else if (tag.startsWith("#")) {
        const cat = tag.slice(1);
        const catId = `cat:${cat}`;
        ensureNode(catId, cat, "category");
        edges.push({
          id: `e_${docNodeId}_${catId}_${edges.length}`,
          source: docNodeId,
          target: catId,
          relation: "categorized_as",
        });
      }
    }
  }

  const graph: KnowledgeGraph = {
    nodes: Array.from(nodesMap.values()),
    edges,
  };
  const res = NextResponse.json({ graph });
  res.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
  return res;
}


