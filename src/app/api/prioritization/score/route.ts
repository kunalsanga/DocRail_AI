import { NextRequest, NextResponse } from "next/server";
import { ImpactScore, RiskLevel } from "@/lib/types";

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    category?: string;
    department?: string;
    riskLevel?: RiskLevel;
    costImpact?: number;
    safetyImpact?: number;
    operationalImpact?: number;
  };

  const baseRisk: Record<RiskLevel, number> = { low: 20, medium: 50, high: 80 } as const;
  const risk = baseRisk[body.riskLevel || "medium"];

  const cost = clamp(body.costImpact ?? (body.category?.toLowerCase().includes("finance") ? 70 : 40));
  const safety = clamp(
    body.safetyImpact ?? (body.category?.toLowerCase().includes("safety") ? 85 : risk)
  );
  const ops = clamp(body.operationalImpact ?? (body.department?.toLowerCase().includes("operations") ? 70 : 45));

  const overall = clamp(Math.round(0.4 * safety + 0.35 * ops + 0.25 * cost));

  const result: ImpactScore = {
    costImpact: cost,
    safetyImpact: safety,
    operationalImpact: ops,
    overall,
  };
  return NextResponse.json({ score: result });
}


