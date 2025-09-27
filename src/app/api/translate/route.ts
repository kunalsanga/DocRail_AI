import { NextRequest, NextResponse } from "next/server";
import { AuditLog, TranslationEntry, UserRef } from "@/lib/types";
import { readJson, writeJson } from "@/lib/storage";
import { translateText } from "@/lib/gemini";
import { getMockTranslation } from "@/lib/mock-translations";

const FILE = "translations.json";
const AUDIT = "audit.json";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      documentId: string;
      text: string;
      sourceLang: "en" | "ml";
      targetLang: "en" | "ml";
      user?: UserRef;
    };
    
    const now = new Date().toISOString();
    
    // Use Gemini API for translation with fallback
    let translated: string;
    try {
      translated = await translateText(body.text, body.sourceLang, body.targetLang);
    } catch (error) {
      console.error('Translation failed, using mock translation:', error);
      translated = getMockTranslation(body.text, body.sourceLang, body.targetLang);
    }
    
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
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}


