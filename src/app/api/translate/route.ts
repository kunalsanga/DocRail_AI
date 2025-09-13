import { NextRequest, NextResponse } from "next/server";
import { AuditLog, TranslationEntry, UserRef } from "@/lib/types";
import { readJson, writeJson } from "@/lib/storage";

const FILE = "translations.json";
const AUDIT = "audit.json";

function mockTranslate(text: string, target: "en" | "ml"): string {
  // Placeholder: keeps text and annotates language for demo purposes.
  if (target === "ml") {
    return `${text} [Malayalam]`;
  }
  return `${text} [English]`;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    documentId: string;
    text: string;
    sourceLang: "en" | "ml";
    targetLang: "en" | "ml";
    user?: UserRef;
  };
  const now = new Date().toISOString();
  const translated = mockTranslate(body.text, body.targetLang);
  const entry: TranslationEntry = {
    id: `tr_${Math.random().toString(36).slice(2)}`,
    documentId: body.documentId,
    sourceLang: body.sourceLang,
    targetLang: body.targetLang,
    sourceText: body.text,
    translatedText: translated,
    createdAt: now,
    createdBy: body.user,
  };

  const all = await readJson<TranslationEntry[]>(FILE, []);
  all.push(entry);
  await writeJson(FILE, all);

  const logs = await readJson<AuditLog[]>(AUDIT, []);
  logs.push({
    id: `aud_${Math.random().toString(36).slice(2)}`,
    documentId: body.documentId,
    actor: body.user || { id: "system", name: "System" },
    action: "translate",
    details: { sourceLang: body.sourceLang, targetLang: body.targetLang },
    createdAt: now,
  });
  await writeJson(AUDIT, logs);

  return NextResponse.json({ translation: entry });
}


