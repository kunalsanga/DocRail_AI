import { NextRequest, NextResponse } from "next/server";
import { ensureFile, readJson, writeJson } from "@/lib/storage";
import { Annotation, AppNotification, AuditLog, DocumentVersion, ExtractedInsight, FeedbackEntry, ModelMetrics, TranslationEntry } from "@/lib/types";

export async function POST(_req: NextRequest) {
  const now = new Date().toISOString();

  // Documents and versions (representative KMRL corpus)
  const versions: DocumentVersion[] = [
    {
      id: "ver_safety_v32",
      documentId: "doc_safety_protocols_v32",
      version: 3,
      filePath: "/docs/safety_protocols_v3_2.pdf",
      summary: "Safety Protocols updated with platform gap monitoring and emergency drill SOPs",
      createdAt: now,
      createdBy: { id: "u_ops_01", name: "Ops Control" },
      changeNote: "Added platform safety checks and multilingual signage"
    },
    {
      id: "ver_station_p2",
      documentId: "doc_station_design_phase2",
      version: 2,
      filePath: "/docs/station_design_phase2.dwg",
      summary: "Station design phase 2 drawings with accessibility upgrades and photovoltaic layout",
      createdAt: now,
      createdBy: { id: "u_eng_02", name: "Design Team" },
      changeNote: "Updated canopy and lift shaft positions"
    },
    {
      id: "ver_compliance_annual",
      documentId: "doc_compliance_annual",
      version: 1,
      filePath: "/docs/annual_compliance_2024.pdf",
      summary: "Annual compliance report covering safety directives and CRMS circulars",
      createdAt: now,
      createdBy: { id: "u_admin_01", name: "Compliance" },
      changeNote: "Initial release"
    },
    {
      id: "ver_eia_2024",
      documentId: "doc_eia_report_2024",
      version: 1,
      filePath: "/docs/eia_2024.pdf",
      summary: "Environmental Impact Assessment for line extension and new depots",
      createdAt: now,
      createdBy: { id: "u_env_01", name: "Environment" },
      changeNote: "Initial EIA"
    },
    {
      id: "ver_hr_policies",
      documentId: "doc_hr_policies",
      version: 4,
      filePath: "/docs/hr_policies_v4.pdf",
      summary: "HR policies update including refresher safety training and on-call allowances",
      createdAt: now,
      createdBy: { id: "u_hr_01", name: "HR" },
      changeNote: "Training schedule and bilingual forms"
    }
  ];

  const annotations: Annotation[] = [
    {
      id: "ann_1",
      documentId: "doc_safety_protocols_v32",
      author: { id: "u_ops_01", name: "Ops Control" },
      target: { type: "document" },
      content: "Update requires platform edge audits each shift.",
      tags: ["#safety", "@Operations"],
      createdAt: now
    },
    {
      id: "ann_2",
      documentId: "doc_station_design_phase2",
      author: { id: "u_eng_02", name: "Design Team" },
      target: { type: "document" },
      content: "Canopy reinforcement to align with wind-load spec.",
      tags: ["#design", "@Engineering", "#infrastructure"],
      createdAt: now
    },
    {
      id: "ann_3",
      documentId: "doc_compliance_annual",
      author: { id: "u_admin_01", name: "Compliance" },
      target: { type: "document" },
      content: "CRS bulletin from Feb incorporated; acknowledgment pending from depots.",
      tags: ["#compliance", "@Operations", "@Engineering"],
      createdAt: now
    },
    {
      id: "ann_4",
      documentId: "doc_eia_report_2024",
      author: { id: "u_env_01", name: "Environment" },
      target: { type: "document" },
      content: "Noise mitigation barriers near school zone.",
      tags: ["#environment", "@Environment", "@Architecture & Planning"],
      createdAt: now
    },
    {
      id: "ann_5",
      documentId: "doc_hr_policies",
      author: { id: "u_hr_01", name: "HR" },
      target: { type: "document" },
      content: "Refresher training to include last night safety bulletin.",
      tags: ["#hr", "#training", "@HR", "@Operations"],
      createdAt: now
    }
  ];

  const audit: AuditLog[] = [
    { id: "aud_1", documentId: "doc_safety_protocols_v32", actor: { id: "u_ops_01", name: "Ops Control" }, action: "update_version", details: { version: 3 }, createdAt: now },
    { id: "aud_2", documentId: "doc_station_design_phase2", actor: { id: "u_eng_02", name: "Design Team" }, action: "upload", details: { file: "dwg" }, createdAt: now },
    { id: "aud_3", documentId: "doc_compliance_annual", actor: { id: "u_admin_01", name: "Compliance" }, action: "upload", details: {}, createdAt: now },
    { id: "aud_4", documentId: "doc_eia_report_2024", actor: { id: "u_env_01", name: "Environment" }, action: "upload", details: {}, createdAt: now },
    { id: "aud_5", documentId: "doc_hr_policies", actor: { id: "u_hr_01", name: "HR" }, action: "annotate", details: { tag: "#training" }, createdAt: now }
  ];

  const notifications: AppNotification[] = [
    { id: "ntf_demo_1", title: "CRS Bulletin Released", message: "CRS Platform Safety Bulletin 2024-02 released.", kind: "new_directive", createdAt: now, intendedRoles: ["admin", "director"], intendedDepartments: ["Operations", "Engineering"], documentId: "doc_crs_bulletin_2024_02", channels: ["push", "email"], readByUserIds: [] },
    { id: "ntf_demo_2", title: "Design Change – Axle Spec v3.1", message: "Procurement to align spare-parts contract.", kind: "department_relevant", createdAt: now, intendedRoles: ["engineer", "admin"], intendedDepartments: ["Engineering", "Commercial"], documentId: "doc_design_change_axle_v31", channels: ["push"], readByUserIds: [] }
  ];

  const insights: ExtractedInsight[] = [
    { id: "ins_demo_1", documentId: "doc_safety_protocols_v32", summary: "Safety SOPs require shift-wise platform audit.", entities: [{ type: "department", value: "Operations", confidence: 0.92 }], safetyScore: 80, complianceScore: 72, overallConfidence: 0.9, createdAt: now },
    { id: "ins_demo_2", documentId: "doc_eia_report_2024", summary: "EIA suggests barrier placement near school zone.", entities: [{ type: "location", value: "School Zone", confidence: 0.8 }], safetyScore: 40, complianceScore: 85, overallConfidence: 0.82, createdAt: now }
  ];

  const feedback: FeedbackEntry[] = [
    { id: "fb_demo_1", userId: "u_ops_01", documentId: "doc_safety_protocols_v32", rating: 5, comment: "Very useful summary for shift briefing.", language: "en", createdAt: now },
    { id: "fb_demo_2", userId: "u_hr_01", documentId: "doc_hr_policies", rating: 4, comment: "Add Malayalam version.", language: "en", createdAt: now }
  ];

  const metrics: ModelMetrics = {
    totalFeedback: feedback.length,
    averageRating: Number((feedback.reduce((a, b) => a + b.rating, 0) / feedback.length).toFixed(2)),
    lastUpdated: now
  };

  const translations: TranslationEntry[] = [
    { id: "tr_demo_1", documentId: "doc_bilingual_safety_notice", sourceLang: "en", targetLang: "ml", sourceText: "Safety briefing for morning shift.", translatedText: "Safety briefing for morning shift. [Malayalam]", createdAt: now },
  ];

  const routing = [
    { id: "rt_demo_1", documentId: "doc_safety_protocols_v32", toRoles: ["engineer", "admin"], toDepartments: ["Operations"], reason: "safety", createdAt: now },
  ];

  // Ensure files exist and then write seed data
  await Promise.all([
    ensureFile("annotations.json", []),
    ensureFile("versions.json", []),
    ensureFile("audit.json", []),
    ensureFile("notifications.json", []),
    ensureFile("insights.json", []),
    ensureFile("feedback.json", []),
    ensureFile("metrics.json", { totalFeedback: 0, averageRating: 0, lastUpdated: now }),
    ensureFile("translations.json", []),
    ensureFile("routing.json", [])
  ]);

  // Merge with existing where applicable to avoid blowing away user demo state
  const [
    existingAnn,
    existingVer,
    existingAudit,
    existingNotif,
    existingInsights,
    existingFeedback,
    _existingMetrics,
    existingTrans,
    existingRouting
  ] = await Promise.all([
    readJson<Annotation[]>("annotations.json", []),
    readJson<DocumentVersion[]>("versions.json", []),
    readJson<AuditLog[]>("audit.json", []),
    readJson<AppNotification[]>("notifications.json", []),
    readJson<ExtractedInsight[]>("insights.json", []),
    readJson<FeedbackEntry[]>("feedback.json", []),
    readJson<ModelMetrics>("metrics.json", { totalFeedback: 0, averageRating: 0, lastUpdated: now }),
    readJson<TranslationEntry[]>("translations.json", []),
    readJson<any[]>("routing.json", [])
  ]);

  const upsert = <T extends { id: string }>(base: T[], add: T[]) => {
    const seen = new Set(base.map(b => b.id));
    for (const item of add) if (!seen.has(item.id)) base.unshift(item);
    return base;
  };

  await Promise.all([
    writeJson("annotations.json", upsert(existingAnn, annotations)),
    writeJson("versions.json", upsert(existingVer, versions)),
    writeJson("audit.json", upsert(existingAudit, audit)),
    writeJson("notifications.json", upsert(existingNotif, notifications)),
    writeJson("insights.json", upsert(existingInsights, insights)),
    writeJson("feedback.json", upsert(existingFeedback, feedback)),
    writeJson("metrics.json", metrics),
    writeJson("translations.json", upsert(existingTrans, translations)),
    writeJson("routing.json", upsert(existingRouting, routing)),
  ]);

  return NextResponse.json({ ok: true, seeded: true, counts: {
    annotations: annotations.length,
    versions: versions.length,
    audit: audit.length,
    notifications: notifications.length,
    insights: insights.length,
    feedback: feedback.length,
  } });
}


