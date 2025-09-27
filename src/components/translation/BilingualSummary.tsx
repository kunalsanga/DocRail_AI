"use client";

import { useMemo, useState, useEffect } from "react";
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
  const [actualSummary, setActualSummary] = useState<string>(englishSummary);
  const { user } = useAuth();

  // Fetch the actual summary from document processing result
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`/api/documents/summary?documentId=${documentId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.summary) {
            // Use the ML-generated summary from document processing
            setActualSummary(data.summary);
            console.log('ML Summary loaded:', data.summary.substring(0, 100) + '...');
          }
        } else if (response.status === 404) {
          // Document not processed yet, keep the placeholder
          console.log('Document not processed yet, keeping placeholder');
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    fetchSummary();
    
    // Refresh summary every 3 seconds to get updates during processing
    const interval = setInterval(fetchSummary, 3000);
    return () => clearInterval(interval);
  }, [documentId]);

  const shown = useMemo(() => (lang === "en" ? actualSummary : mlText || ""), [lang, actualSummary, mlText]);

  const translate = async () => {
    if (lang === "ml" && !mlText) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/translate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentId,
            text: actualSummary,
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
        {actualSummary === englishSummary && actualSummary.includes('Processing summary for') ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">🤖 ML Processing document analysis...</p>
          </div>
        ) : (
          <div>
            <p className="text-sm whitespace-pre-wrap">{shown || (lang === "ml" ? "No Malayalam translation yet." : "No summary.")}</p>
            {actualSummary !== englishSummary && actualSummary.length > 50 && (
              <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                <span>✅</span>
                <span>ML-Powered Summary Generated</span>
              </div>
            )}
          </div>
        )}
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


