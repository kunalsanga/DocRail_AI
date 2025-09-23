import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/storage";
import { AppNotification, AuditLog, Department, UserRole } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any));
  const text: string = (body.text || "").toString();
  const language: "en" | "ml" = body.language === "ml" ? "ml" : "en";
  const documentId: string | undefined = body.documentId;

  // Very simple keyword-based safety detection stub
  const safetyKeywordsEn = ["safety", "hazard", "accident", "warning", "incident"];
  const safetyKeywordsMl = ["സുരക്ഷ", "അപകടം", "മുന്നറിയിപ്പ്"]; // Malayalam examples

  const hay = text.toLowerCase();
  const matched: string[] = [];
  for (const k of safetyKeywordsEn) if (hay.includes(k)) matched.push(k);
  for (const k of safetyKeywordsMl) if (hay.includes(k)) matched.push(k);

  const triggered = matched.length > 0;
  const safetyScore = Math.min(100, matched.length * 30);

  // Write audit log
  try {
    const logs = await readJson<AuditLog[]>("audit.json", []);
    logs.push({
      id: `aud_${Math.random().toString(36).slice(2)}`,
      documentId,
      actor: { id: "system", name: "Safety Detector" },
      action: "notify",
      details: { matched, safetyScore },
      createdAt: new Date().toISOString(),
    });
    await writeJson("audit.json", logs);
  } catch (e) {
    console.error("Failed to write safety audit:", e);
  }

  // Create notification when triggered
  if (triggered) {
    try {
      const notifs = await readJson<AppNotification[]>("notifications.json", []);
      const notif: AppNotification = {
        id: `ntf_${Math.random().toString(36).slice(2)}`,
        title: language === "ml" ? "സുരക്ഷാ മുന്നറിയിപ്പ്" : "Safety Alert",
        message:
          language === "ml"
            ? "ടെക്സ്റ്റിൽ സുരക്ഷാ സിഗ്നലുകൾ കണ്ടെത്തി. ദയവായി പരിശോധിക്കുക."
            : "Safety signals detected in content. Please review.",
        kind: "new_directive",
        createdAt: new Date().toISOString(),
        intendedRoles: ["engineer", "admin"] as UserRole[],
        intendedDepartments: ["Operations"] as Department[],
        documentId,
        channels: ["push"],
        readByUserIds: [],
      };
      notifs.unshift(notif);
      await writeJson("notifications.json", notifs);
    } catch (e) {
      console.error("Failed to persist safety notification:", e);
    }
  }

  return NextResponse.json({ triggered, safetyScore, matched }, { status: 200 });
}


