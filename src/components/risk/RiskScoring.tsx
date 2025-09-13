"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  category?: string;
  department?: string;
  riskLevel?: "low" | "medium" | "high";
}

export default function RiskScoring({ category, department, riskLevel }: Props) {
  const [cost, setCost] = useState<number | "">("");
  const [safety, setSafety] = useState<number | "">("");
  const [ops, setOps] = useState<number | "">("");
  const [overall, setOverall] = useState<number | null>(null);

  const compute = async () => {
    const res = await fetch(`/api/prioritization/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        department,
        riskLevel,
        costImpact: cost === "" ? undefined : Number(cost),
        safetyImpact: safety === "" ? undefined : Number(safety),
        operationalImpact: ops === "" ? undefined : Number(ops),
      }),
    });
    const data = await res.json();
    setOverall(data.score?.overall ?? null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Scoring</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <Input placeholder="Cost (0-100)" value={cost} onChange={(e) => setCost(e.target.value === "" ? "" : Number(e.target.value))} />
          <Input placeholder="Safety (0-100)" value={safety} onChange={(e) => setSafety(e.target.value === "" ? "" : Number(e.target.value))} />
          <Input placeholder="Ops (0-100)" value={ops} onChange={(e) => setOps(e.target.value === "" ? "" : Number(e.target.value))} />
        </div>
        <Button onClick={compute}>Compute</Button>
        {overall !== null && (
          <div className="text-sm text-muted-foreground">Overall Impact Score: <span className="font-medium">{overall}</span></div>
        )}
      </CardContent>
    </Card>
  );
}


