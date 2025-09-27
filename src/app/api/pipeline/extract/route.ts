import { NextRequest, NextResponse } from "next/server";
import { AppNotification, AuditLog, Department, ExtractedInsight, NlpEntity, OcrResult, UserRole } from "@/lib/types";
import { readJson, writeJson } from "@/lib/storage";
import { localDocumentProcessor } from "@/lib/local-document-processor";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const documentId: string = body.documentId || `doc_${Math.random().toString(36).slice(2)}`;
    const documentText = body.text || "Sample extracted text from OCR pipeline.";
    const language = body.language === "ml" ? "ml" : "en";
    const fileName = body.fileName || "unknown_document";

    // Use the new local document processor (no external API keys required)
    const processingResult = await localDocumentProcessor.processDocument(
      new File([documentText], fileName, { type: 'text/plain' }),
      documentId,
      language
    );

    // OCR output
    const ocr: OcrResult = {
      language: processingResult.ocr.language,
      text: processingResult.ocr.text,
      confidence: processingResult.ocr.confidence,
    };

    // Convert extracted entities to NlpEntity format
    const nlpEntities: NlpEntity[] = [
      ...processingResult.analysis.entities.departments.map(dept => ({ type: "department" as const, value: dept, confidence: 0.8 })),
      ...processingResult.analysis.entities.dates.map(date => ({ type: "deadline" as const, value: date, confidence: 0.7 })),
      ...processingResult.analysis.entities.amounts.map(amount => ({ type: "amount" as const, value: amount, confidence: 0.8 })),
      ...processingResult.analysis.entities.locations.map(location => ({ type: "location" as const, value: location, confidence: 0.7 })),
      ...processingResult.analysis.entities.people.map(person => ({ type: "person" as const, value: person, confidence: 0.6 })),
      ...processingResult.analysis.entities.regulations.map(regulation => ({ type: "regulation" as const, value: regulation, confidence: 0.9 })),
    ];

    const insight: ExtractedInsight = {
      id: `ins_${Math.random().toString(36).slice(2)}`,
      documentId,
      summary: processingResult.analysis.summary,
      entities: nlpEntities,
      safetyScore: processingResult.analysis.safety.safetyScore,
      complianceScore: processingResult.analysis.classification.category === 'Compliance' ? 85 : 60,
      overallConfidence: processingResult.analysis.confidence,
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
        // Skip auto-routing for now to prevent errors
        console.log("Auto-routing would be triggered for document:", documentId);
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


