import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/storage";
import { AuditLog } from "@/lib/types";

interface RoutingEntry {
  id: string;
  documentId: string;
  insightId?: string;
  toRoles?: string[];
  toDepartments?: string[];
  reason?: string; // e.g., safety, compliance, department relevance
  createdAt: string; // ISO
}

const FILE = "routing.json";

export async function GET() {
  const all = await readJson<RoutingEntry[]>(FILE, []);
  return NextResponse.json({ routes: all });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const entry: RoutingEntry = {
    id: body.id || `rt_${Math.random().toString(36).slice(2)}`,
    documentId: body.documentId,
    insightId: body.insightId,
    toRoles: body.toRoles || ["engineer"],
    toDepartments: body.toDepartments || ["Operations"],
    reason: body.reason || "safety",
    createdAt: new Date().toISOString(),
  };

  try {
    const all = await readJson<RoutingEntry[]>(FILE, []);
    all.unshift(entry);
    await writeJson(FILE, all);
  } catch (e) {
    console.error("Failed to persist routing entry:", e);
  }

  // Audit
  try {
    const logs = await readJson<AuditLog[]>("audit.json", []);
    logs.push({
      id: `aud_${Math.random().toString(36).slice(2)}`,
      documentId: entry.documentId,
      actor: { id: "system", name: "Auto Router" },
      action: "notify",
      details: { routeId: entry.id, toRoles: entry.toRoles, toDepartments: entry.toDepartments, reason: entry.reason },
      createdAt: new Date().toISOString(),
    });
    await writeJson("audit.json", logs);
  } catch (e) {
    console.error("Failed to write routing audit:", e);
  }

  return NextResponse.json({ route: entry }, { status: 201 });
}


