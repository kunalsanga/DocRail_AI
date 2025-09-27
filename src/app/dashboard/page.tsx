"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DocumentMetrics {
  totalDocuments: number;
  processedToday: number;
  pendingReview: number;
  complianceRate: number;
}

interface ComplianceStatus {
  compliant: number;
  nonCompliant: number;
  pendingReview: number;
  criticalAlerts: number;
}

interface TranslationStats {
  totalTranslations: number;
  languagesSupported: number;
  accuracyRate: number;
  pendingTranslations: number;
}

interface SafetyAlerts {
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  resolved: number;
}

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const [ingestStatus, setIngestStatus] = useState<{source: string; lastRun?: string; ok: boolean; documentsProcessed: number}[]>([]);
  const [documentMetrics, setDocumentMetrics] = useState<DocumentMetrics | null>(null);
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus | null>(null);
  const [translationStats, setTranslationStats] = useState<TranslationStats | null>(null);
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlerts | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    // Demo: set fake ingestion status with realistic data
    setIngestStatus([
      { source: "Email", lastRun: new Date(Date.now() - 15 * 60 * 1000).toISOString(), ok: true, documentsProcessed: 47 },
      { source: "WhatsApp", lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), ok: true, documentsProcessed: 23 },
      { source: "SharePoint", lastRun: new Date(Date.now() - 30 * 60 * 1000).toISOString(), ok: true, documentsProcessed: 156 },
      { source: "Maximo", lastRun: new Date(Date.now() - 45 * 60 * 1000).toISOString(), ok: false, documentsProcessed: 0 },
    ]);

    // Demo: set document metrics
    setDocumentMetrics({
      totalDocuments: 1247,
      processedToday: 89,
      pendingReview: 23,
      complianceRate: 94.2
    });

    // Demo: set compliance status
    setComplianceStatus({
      compliant: 1174,
      nonCompliant: 45,
      pendingReview: 28,
      criticalAlerts: 3
    });

    // Demo: set translation stats
    setTranslationStats({
      totalTranslations: 456,
      languagesSupported: 12,
      accuracyRate: 96.8,
      pendingTranslations: 12
    });

    // Demo: set safety alerts
    setSafetyAlerts({
      highRisk: 2,
      mediumRisk: 7,
      lowRisk: 15,
      resolved: 43
    });

    // Demo: set recent activity
    setRecentActivity([
      { id: 1, type: "upload", message: "15 safety documents uploaded via SharePoint", timestamp: new Date(Date.now() - 5 * 60 * 1000), status: "success" },
      { id: 2, type: "translation", message: "89 documents translated to Hindi", timestamp: new Date(Date.now() - 12 * 60 * 1000), status: "success" },
      { id: 3, type: "compliance", message: "Compliance check failed for 3 documents", timestamp: new Date(Date.now() - 25 * 60 * 1000), status: "warning" },
      { id: 4, type: "processing", message: "AI extraction completed for 47 forms", timestamp: new Date(Date.now() - 45 * 60 * 1000), status: "success" },
      { id: 5, type: "alert", message: "High-risk safety document detected", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), status: "error" },
    ]);

    fetch("/api/feedback")
      .then(r => r.json())
      .then(d => setModelMetrics(d.metrics))
      .catch(() => setModelMetrics(null));

    // Simulate real-time updates every 10 seconds for demo
    const interval = setInterval(() => {
      // Update document metrics
      setDocumentMetrics(prev => prev ? ({
        ...prev,
        processedToday: prev.processedToday + Math.floor(Math.random() * 3),
        pendingReview: Math.max(0, prev.pendingReview + Math.floor(Math.random() * 2) - 1)
      }) : null);

      // Add new activity
      const newActivity = {
        id: Date.now(),
        type: ["upload", "translation", "compliance", "processing", "alert"][Math.floor(Math.random() * 5)],
        message: [
          "New document uploaded and processed",
          "Translation completed for 5 documents",
          "Compliance check passed for 12 documents",
          "AI analysis completed for safety report",
          "New notification received"
        ][Math.floor(Math.random() * 5)],
        timestamp: new Date(),
        status: ["success", "warning", "error"][Math.floor(Math.random() * 3)]
      };

      setRecentActivity(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const [modelMetrics, setModelMetrics] = useState<{totalFeedback: number; averageRating: number} | null>(null);

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">
          {language === "ml" ? "ഡോക്യുമെന്റ് ഹബ് ഡാഷ്ബോർഡ്" : "Document Hub Dashboard"}
        </h1>
        <div className="text-sm text-slate-500">
          {language === "ml" ? "അവസാനം അപ്ഡേറ്റ് ചെയ്തത്" : "Last updated"}: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Key Metrics Overview */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          {language === "ml" ? "പ്രധാന മെട്രിക്സ് അവലോകനം" : "Key Metrics Overview"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">{t("stats.totalDocs")}</p>
                <p className="text-3xl font-bold">{documentMetrics?.totalDocuments.toLocaleString()}</p>
              </div>
              <div className="text-blue-200 text-2xl">📄</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">
                  {language === "ml" ? "ഇന്ന് പ്രോസസ്സുചെയ്തത്" : "Processed Today"}
                </p>
                <p className="text-3xl font-bold">{documentMetrics?.processedToday}</p>
              </div>
              <div className="text-green-200 text-2xl">⚡</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">
                  {language === "ml" ? "കമ്പ്ലയൻസ് നിരക്ക്" : "Compliance Rate"}
                </p>
                <p className="text-3xl font-bold">{documentMetrics?.complianceRate}%</p>
              </div>
              <div className="text-yellow-200 text-2xl">✅</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">{t("stats.pendingReview")}</p>
                <p className="text-3xl font-bold">{documentMetrics?.pendingReview}</p>
              </div>
              <div className="text-purple-200 text-2xl">⏳</div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Ingestion Status */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Document Ingestion Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ingestStatus.map((s) => (
            <div key={s.source} className={`border rounded-lg p-4 ${s.ok ? 'bg-white border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-600">{s.source}</div>
                  <div className={`text-base font-semibold mt-1 ${s.ok ? 'text-green-600' : 'text-red-600'}`}>
                    {s.ok ? "Healthy" : "Error"}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Last run: {new Date(s.lastRun || Date.now()).toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500">
                    Documents processed: {s.documentsProcessed}
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${s.ok ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance & Safety Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Compliance Status</h2>
          <div className="bg-white border rounded-lg p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{complianceStatus?.compliant}</div>
                <div className="text-sm text-slate-600">Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{complianceStatus?.nonCompliant}</div>
                <div className="text-sm text-slate-600">Non-Compliant</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pending Review</span>
                <span className="font-semibold">{complianceStatus?.pendingReview}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Critical Alerts</span>
                <span className="font-semibold text-red-600">{complianceStatus?.criticalAlerts}</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Safety Document Alerts</h2>
          <div className="bg-white border rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-semibold text-red-700">High Risk</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{safetyAlerts?.highRisk}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-semibold text-yellow-700">Medium Risk</span>
                </div>
                <span className="text-2xl font-bold text-yellow-600">{safetyAlerts?.mediumRisk}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-semibold text-green-700">Resolved</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{safetyAlerts?.resolved}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Translation & Language Processing */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Translation & Language Processing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{translationStats?.totalTranslations}</div>
            <div className="text-sm text-slate-600">Total Translations</div>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{translationStats?.languagesSupported}</div>
            <div className="text-sm text-slate-600">Languages Supported</div>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{translationStats?.accuracyRate}%</div>
            <div className="text-sm text-slate-600">Accuracy Rate</div>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">{translationStats?.pendingTranslations}</div>
            <div className="text-sm text-slate-600">Pending</div>
          </div>
        </div>
      </section>

      {/* Workflow Templates */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Document Processing Workflows</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: "safety_document_processing", name: "Safety Document Processing", description: "AI-powered safety document analysis and risk assessment", icon: "🛡️" },
            { id: "compliance_audit", name: "Compliance Audit", description: "Automated compliance checking and reporting", icon: "📋" },
            { id: "multilingual_translation", name: "Multilingual Translation", description: "Batch translation with quality assurance", icon: "🌐" },
            { id: "document_classification", name: "Document Classification", description: "Intelligent document categorization and tagging", icon: "🏷️" },
            { id: "knowledge_extraction", name: "Knowledge Extraction", description: "Extract insights and build knowledge graphs", icon: "🧠" },
            { id: "bulk_processing", name: "Bulk Processing", description: "Process large volumes of documents efficiently", icon: "⚡" },
          ].map(t => (
            <div key={t.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{t.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">{t.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{t.description}</p>
                  <button
                    onClick={async (e) => {
                      // Show loading state
                      const button = e.target as HTMLButtonElement;
                      const originalText = button.textContent;
                      button.textContent = "Running...";
                      button.disabled = true;
                      
                      // Simulate workflow execution
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      
                      // Show success message
                      alert(`✅ Workflow "${t.name}" completed successfully!\n\n📊 Results:\n• Documents processed: ${Math.floor(Math.random() * 50) + 10}\n• Processing time: ${(Math.random() * 5 + 1).toFixed(1)}s\n• Success rate: ${(Math.random() * 10 + 90).toFixed(1)}%`);
                      
                      // Reset button
                      button.textContent = originalText;
                      button.disabled = false;
                    }}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Run Workflow
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Activity</h2>
        <div className="bg-white border rounded-lg p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-500' : 
                  activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800">{activity.message}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'success' ? 'bg-green-100 text-green-700' : 
                  activity.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {activity.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Model Quality Metrics */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">AI Model Performance</h2>
        <div className="bg-white border rounded-lg p-6">
          {modelMetrics ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{modelMetrics.totalFeedback}</div>
                <div className="text-sm text-slate-600">Total Feedback</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{modelMetrics.averageRating}/5</div>
                <div className="text-sm text-slate-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">96.8%</div>
                <div className="text-sm text-slate-600">Accuracy Rate</div>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-8">
              <div className="text-4xl mb-2">🤖</div>
              <p>AI model metrics will appear here once feedback is collected</p>
            </div>
          )}
        </div>
      </section>

      {/* Action Buttons */}
      <section>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={async () => { await fetch("/api/demo/seed", { method: "POST" }); alert("Demo data seeded successfully!"); }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Seed Demo Data
          </button>
          <button
            onClick={() => window.location.href = '/upload'}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Upload Documents
          </button>
          <button
            onClick={() => window.location.href = '/search'}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Search Documents
          </button>
        </div>
      </section>
    </div>
  );
}
