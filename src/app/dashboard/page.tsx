"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [ingestStatus, setIngestStatus] = useState<{source: string; lastRun?: string; ok: boolean}[]>([]);
  const [modelMetrics, setModelMetrics] = useState<{totalFeedback: number; averageRating: number} | null>(null);

  useEffect(() => {
    // Demo: set fake ingestion last-run
    setIngestStatus([
      { source: "Email", lastRun: new Date().toISOString(), ok: true },
      { source: "WhatsApp", lastRun: new Date().toISOString(), ok: true },
      { source: "SharePoint", lastRun: new Date().toISOString(), ok: true },
      { source: "Maximo", lastRun: new Date().toISOString(), ok: true },
    ]);

    fetch("/api/feedback")
      .then(r => r.json())
      .then(d => setModelMetrics(d.metrics))
      .catch(() => setModelMetrics(null));
  }, []);

  return (
    <div className="px-4 py-6 space-y-6">
      <section>
        <h2 className="text-xl font-semibold text-slate-800">Ingestion Status</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ingestStatus.map((s) => (
            <div key={s.source} className="border rounded-md p-4 bg-white">
              <div className="text-sm text-slate-600">{s.source}</div>
              <div className="text-base font-semibold mt-1">{s.ok ? "Healthy" : "Error"}</div>
              <div className="text-xs text-slate-500 mt-1">Last run: {new Date(s.lastRun || Date.now()).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800">Run Workflow Template</h2>
        <div className="mt-3 flex gap-3 flex-wrap">
          {[
            { id: "incident_report", name: "Incident Report" },
            { id: "purchase_order", name: "Purchase Order" },
            { id: "compliance_audit", name: "Compliance Audit" },
          ].map(t => (
            <button
              key={t.id}
              onClick={async () => {
                await fetch("/api/pipeline/extract", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ templateId: t.id, documentIds: ["doc_demo_1"] }) });
                alert(`Triggered: ${t.name}`);
              }}
              className="px-3 py-2 border rounded-md bg-white hover:bg-slate-50"
            >
              {t.name}
            </button>
          ))}
          <button
            onClick={async () => { await fetch("/api/demo/seed", { method: "POST" }); alert("Seeded demo data"); }}
            className="px-3 py-2 border rounded-md bg-white hover:bg-slate-50"
          >
            Seed Demo Data
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800">Model Quality Over Time</h2>
        <div className="mt-3 border rounded-md p-4 bg-white">
          {modelMetrics ? (
            <div className="text-sm text-slate-700">Total feedback: <b>{modelMetrics.totalFeedback}</b> · Avg rating: <b>{modelMetrics.averageRating}</b></div>
          ) : (
            <div className="text-sm text-slate-500">No feedback yet</div>
          )}
        </div>
      </section>
    </div>
  );
}
