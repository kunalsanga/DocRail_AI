"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  documentId: string;
  englishSummary: string;
}

export default function BilingualSummary({ documentId, englishSummary }: Props) {
  const [lang, setLang] = useState<"en" | "ml">("en");
  const [mlText, setMlText] = useState<string>("");
  const [correction, setCorrection] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const shown = useMemo(() => (lang === "en" ? englishSummary : mlText || ""), [lang, englishSummary, mlText]);

  const translate = async () => {
    if (lang === "ml" && !mlText) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/translate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentId,
            text: englishSummary,
            sourceLang: "en",
            targetLang: "ml",
            user,
          }),
        });
        const data = await res.json();
        setMlText(data.translation?.translatedText || "");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Summary</CardTitle>
        <div className="flex gap-2">
          <Button variant={lang === "en" ? "default" : "secondary"} onClick={() => setLang("en")}>EN</Button>
          <Button
            variant={lang === "ml" ? "default" : "secondary"}
            onClick={() => {
              setLang("ml");
              void translate();
            }}
            disabled={isLoading}
          >
            {isLoading ? "Translating..." : "ML"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-wrap">{shown || (lang === "ml" ? "No Malayalam translation yet." : "No summary.")}</p>
        {lang === "ml" && (
          <div className="mt-3 flex gap-2">
            <input
              value={correction}
              onChange={(e) => setCorrection(e.target.value)}
              placeholder="Suggest Malayalam correction"
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <Button
              variant="secondary"
              onClick={async () => {
                if (!correction.trim()) return;
                await fetch("/api/feedback", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    documentId,
                    rating: 5,
                    comment: `ml_correction:${correction}`,
                    language: "ml",
                    userId: user?.id,
                  }),
                });
                setCorrection("");
                alert("Thanks! We'll learn from this correction.");
              }}
            >
              Submit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


