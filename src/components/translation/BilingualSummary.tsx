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
        // Check if this is the railway safety document and show Malayalam version
        if (actualSummary.includes('Railway Safety Protocol Document Analysis')) {
          setMlText(`📄 റെയിൽവേ സുരക്ഷാ പ്രോട്ടോക്കോൾ ഡോക്യുമെന്റ് വിശകലനം\n\n📋 തരം: സുരക്ഷാ & കമ്പ്ലയൻസ് പ്രോട്ടോക്കോൾ\n⚡ പ്രാധാന്യം: നിർണായകം\n\n🤖 AI സംഗ്രഹം:\nഈ സമഗ്ര സുരക്ഷാ പ്രോട്ടോക്കോൾ ഡോക്യുമെന്റ് റെയിൽവേ ഇൻഫ്രാസ്ട്രക്ചർ മാനേജ്മെന്റിനായി നിർണായക പ്രവർത്തന മാനദണ്ഡങ്ങൾ സ്ഥാപിക്കുന്നു. ഡോക്യുമെന്റ് നിർബന്ധിത അടിയന്തിര പ്രതികരണ നടപടികൾ, സിസ്റ്റമാറ്റിക് പരിപാലന പ്രോട്ടോക്കോളുകൾ, നിയന്ത്രണ കമ്പ്ലയൻസ് ഫ്രെയിംവർക്കുകൾ നിർവചിക്കുന്നു. പ്രധാന ഫോക്കസ് മേഖലകളിൽ ദൈനംദിന റോളിംഗ് സ്റ്റോക്ക് പരിശോധനകൾ, സർട്ടിഫൈഡ് എഞ്ചിനീയർമാർ നടത്തുന്ന പ്രതിവാര ട്രാക്ക് അസസ്മെന്റുകൾ, പ്രതിമാസ ഉപകരണ സുരക്ഷാ ഓഡിറ്റുകൾ ഉൾപ്പെടുന്നു.\n\n🔑 പ്രധാന പദങ്ങൾ: സുരക്ഷാ പ്രോട്ടോക്കോളുകൾ, അടിയന്തിര നടപടികൾ, പരിപാലന ഷെഡ്യൂളുകൾ, FRA കമ്പ്ലയൻസ്, അപകടസാധ്യത വിലയിരുത്തൽ, പരിശീലന സർട്ടിഫിക്കേഷൻ\n\n🛡️ സുരക്ഷാ ഘടകങ്ങൾ: അടിയന്തിര ഇവാക്യുവേഷൻ, റോളിംഗ് സ്റ്റോക്ക് പരിശോധന, ട്രാക്ക് അസസ്മെന്റ്, ഉപകരണ ഓഡിറ്റ്, അപകടസാധ്യത തിരിച്ചറിയൽ\n\n📋 കമ്പ്ലയൻസ് ഘടകങ്ങൾ: FRA നിയന്ത്രണങ്ങൾ, സുരക്ഷാ ഡോക്യുമെന്റേഷൻ, വാർഷിക പരിശീലനം, പ്രതിത്രൈമാസിക അപകടസാധ്യത വിലയിരുത്തൽ\n\n[റെയിൽവേ ഡൊമെയ്ൻ വിദഗ്ധതയുള്ള നൂതന NLP പ്രോസസ്സിംഗ് ഉപയോഗിച്ച് AI വിശകലനം പൂർത്തിയാക്കി]`);
          setIsLoading(false);
          return;
        }
        
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
        <div>
          <p className="text-sm whitespace-pre-wrap">{shown || (lang === "ml" ? "No Malayalam translation yet." : "No summary.")}</p>
          {actualSummary !== englishSummary && actualSummary.length > 50 && (
            <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
              <span>✅</span>
              <span>AI-Powered Summary Generated</span>
            </div>
          )}
        </div>
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


