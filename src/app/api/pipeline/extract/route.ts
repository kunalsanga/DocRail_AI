import { NextRequest, NextResponse } from "next/server";
import { AppNotification, AuditLog, Department, ExtractedInsight, NlpEntity, OcrResult, UserRole } from "@/lib/types";
import { readJson, writeJson } from "@/lib/storage";
import { summarizeDocument, extractEntities, classifyDocument } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const documentId: string = body.documentId || `doc_${Math.random().toString(36).slice(2)}`;
    const documentText = body.text || "Sample extracted text from OCR pipeline.";
    const language = body.language === "ml" ? "ml" : "en";

    // Use Gemini API for document processing
    const [summary, entities, classification] = await Promise.all([
      summarizeDocument(documentText, language),
      extractEntities(documentText),
      classifyDocument(documentText)
    ]);

    // OCR output
    const ocr: OcrResult = {
      language,
      text: documentText,
      confidence: 0.93,
    };

    // Convert extracted entities to NlpEntity format
    const nlpEntities: NlpEntity[] = [
      ...entities.departments.map(dept => ({ type: "department" as const, value: dept, confidence: 0.8 })),
      ...entities.dates.map(date => ({ type: "deadline" as const, value: date, confidence: 0.7 })),
      ...entities.amounts.map(amount => ({ type: "amount" as const, value: amount, confidence: 0.8 })),
      ...entities.locations.map(location => ({ type: "location" as const, value: location, confidence: 0.7 })),
      ...entities.people.map(person => ({ type: "person" as const, value: person, confidence: 0.6 })),
      ...entities.regulations.map(regulation => ({ type: "regulation" as const, value: regulation, confidence: 0.9 })),
    ];

    const insight: ExtractedInsight = {
      id: `ins_${Math.random().toString(36).slice(2)}`,
      documentId,
      summary,
      entities: nlpEntities,
      safetyScore: classification.priority === 'critical' ? 90 : classification.priority === 'high' ? 75 : 50,
      complianceScore: classification.category === 'Compliance' ? 85 : 60,
      overallConfidence: 0.87,
      createdAt: new Date().toISOString(),
    };

    // Persist: insights
    try {
      const insights = await readJson<ExtractedInsight[]>("insights.json", []);
      insights.unshift(insight);
      await writeJson("insights.json", insights);
    } catch (e) {
      console.error("Failed to persist insights:", e);
    }

    // Audit trail entry
    try {
      const logs = await readJson<AuditLog[]>("audit.json", []);
      const log: AuditLog = {
        id: `aud_${Math.random().toString(36).slice(2)}`,
        documentId,
        actor: { id: "system", name: "AI Pipeline" },
        action: "summarize",
        details: { insightId: insight.id, overallConfidence: insight.overallConfidence },
        createdAt: new Date().toISOString(),
      };
      logs.push(log);
      await writeJson("audit.json", logs);
    } catch (e) {
      console.error("Failed to write audit log:", e);
    }

    // Safety/Review notifications
    const reviewRequired = (insight.safetyScore || 0) > 70 || (insight.complianceScore || 0) < 60;
    if (reviewRequired) {
      try {
        const notifs = await readJson<AppNotification[]>("notifications.json", []);
        const notif: AppNotification = {
          id: `ntf_${Math.random().toString(36).slice(2)}`,
          title: ocr.language === "ml" ? "മാനുവൽ റിവ്യൂ ആവശ്യമാണ്" : "Manual Review Required",
          message:
            ocr.language === "ml"
              ? "സുരക്ഷ/കമ്പ്ലയൻസ് സംശയം കണ്ടെത്തി. ദയവായി രേഖ പരിശോധിക്കുക."
              : "Potential safety/compliance concern detected. Please review the document.",
          kind: "deadline_approaching",
          createdAt: new Date().toISOString(),
          intendedRoles: ["engineer", "admin"] as UserRole[],
          intendedDepartments: ["Operations"] as Department[],
          documentId,
          channels: ["push"] as AppNotification["channels"],
          readByUserIds: [],
        };
        notifs.unshift(notif);
        await writeJson("notifications.json", notifs);
      } catch (e) {
        console.error("Failed to persist notification:", e);
      }
    }

    // Auto-route when safety is high or department detected
    try {
      if (reviewRequired) {
        await fetch("/api/routing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentId,
            insightId: insight.id,
            toRoles: ["engineer", "admin"],
            toDepartments: ["Operations"],
            reason: "safety",
          }),
        });
      }
    } catch (e) {
      console.error("Auto-routing failed:", e);
    }

    return NextResponse.json(
      {
        documentId,
        ocr,
        insight,
        reviewRequired,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Pipeline extraction error:', error);
    return NextResponse.json(
      { error: 'Document processing failed' },
      { status: 500 }
    );
  }
}


