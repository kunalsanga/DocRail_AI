import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/storage";
import { FeedbackEntry, ModelMetrics } from "@/lib/types";

const FEED_FILE = "feedback.json";
const METRICS_FILE = "metrics.json";

export async function GET() {
  const feedback = await readJson<FeedbackEntry[]>(FEED_FILE, []);
  const metrics = await readJson<ModelMetrics>(METRICS_FILE, {
    totalFeedback: feedback.length,
    averageRating: feedback.length ? feedback.reduce((a, b) => a + b.rating, 0) / feedback.length : 0,
    lastUpdated: new Date().toISOString(),
  });
  return NextResponse.json({ feedback, metrics });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const entry: FeedbackEntry = {
    id: body.id || `fb_${Math.random().toString(36).slice(2)}`,
    userId: body.userId,
    documentId: body.documentId,
    insightId: body.insightId,
    rating: Math.max(1, Math.min(5, Number(body.rating) || 3)),
    comment: body.comment || "",
    language: body.language === "ml" ? "ml" : "en",
    createdAt: new Date().toISOString(),
  };

  const feedback = await readJson<FeedbackEntry[]>(FEED_FILE, []);
  feedback.unshift(entry);
  await writeJson(FEED_FILE, feedback);

  const avg = feedback.reduce((a, b) => a + b.rating, 0) / feedback.length;
  const metrics: ModelMetrics = {
    totalFeedback: feedback.length,
    averageRating: Number(avg.toFixed(2)),
    lastUpdated: new Date().toISOString(),
  };
  await writeJson(METRICS_FILE, metrics);

  return NextResponse.json({ feedback: entry, metrics }, { status: 201 });
}


