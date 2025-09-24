import { NextRequest, NextResponse } from "next/server";
import { readJson } from "@/lib/storage";
import { AuditLog } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "Q3";
  const format = (searchParams.get("format") || "json").toLowerCase();
  const logs = await readJson<AuditLog[]>("audit.json", []);

  const summary = {
    period,
    total: logs.length,
    uploads: logs.filter(l => l.action === "upload").length,
    updates: logs.filter(l => l.action === "update_version").length,
    annotations: logs.filter(l => l.action === "annotate").length,
    summarized: logs.filter(l => l.action === "summarize").length,
    byDepartment: logs.reduce<Record<string, number>>((acc, l) => {
      const d = (l.actor?.department as string) || "Unknown";
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {}),
  };

  if (format === "csv") {
    const rows = [
      ["period","total","uploads","updates","annotations","summarized"].join(","),
      [summary.period, summary.total, summary.uploads, summary.updates, summary.annotations, summary.summarized].join(","),
    ];
    return new NextResponse(rows.join("\n"), { headers: { "Content-Type": "text/csv; charset=utf-8" } });
  }
  return NextResponse.json({ summary });
}


