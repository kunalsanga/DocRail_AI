"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type LanguageCode = "en" | "ml";

type Dictionary = Record<string, string>;

const en: Dictionary = {
  "gov.title.hi": "भारत सरकार |",
  "gov.title.en": "Government of India",
  "gov.skip": "Skip to content",
  "gov.english": "English",
  "nav.about": "About Us",
  "nav.initiatives": "DI Initiatives",
  "nav.ecosystem": "DI Ecosystem",
  "search.placeholder": "Search here...",
  // Sidebar
  "sidebar.navigation": "NAVIGATION",
  "sidebar.dashboard": "Dashboard",
  "sidebar.upload": "Upload Documents",
  "sidebar.search": "Search & Filter",
  "sidebar.compliance": "Compliance",
  "sidebar.notifications": "Notifications",
  "sidebar.knowledge": "Knowledge Hub",
  // Dashboard header
  "dash.greeting": "Good morning, Admin",
  "dash.greet.morning": "Good morning",
  "dash.greet.afternoon": "Good afternoon",
  "dash.greet.evening": "Good evening",
  "dash.greet.night": "Good night",
  "dash.subtitle": "Here's your document overview for admin",
  "dash.filter.today": "Today",
  "dash.filter.week": "This Week",
  "dash.filter.month": "This Month",
  "dash.upload": "Upload Document",
  // Cards
  "dash.docsProcessed": "Documents Processed",
  "dash.aiAccuracy": "AI Accuracy",
  "dash.processingTime": "Processing Time",
  "dash.complianceRate": "Compliance Rate",
  "dash.aiFeed": "AI Document Feed",
  "dash.live": "Live Processing",
  // Search page
  "search.title": "Intelligent Search",
  "search.subtitle": "AI-powered search across all documents with natural language processing",
  "search.ai": "AI-Powered Search",
  "search.ai.desc": "Search in English or Malayalam with intelligent understanding",
  "search.bar.placeholder": "Search documents... (e.g., 'safety protocols', 'budget reports', 'മെട്രോ നിയമങ്ങൾ')",
  "search.filters.language": "Language",
  "search.filters.department": "Department",
  "search.filters.date": "Date Range",
  "search.lang.all": "All Languages",
  "search.lang.en": "English",
  "search.lang.ml": "Malayalam",
  "search.lang.bi": "Bilingual",
  "search.date.all": "All Time",
  "search.date.today": "Today",
  "search.date.week": "This Week",
  "search.date.month": "This Month",
  "search.date.quarter": "This Quarter",
  "search.results": "Search Results",
  "search.results.time": "Results in 0.3 seconds",
  "search.ai.summary": "AI Summary",
  "search.view": "View Document",
  "search.download": "Download",
  "search.share": "Share",
  "search.processed": "Processed by AI",
  // Upload page
  "upload.title": "Upload Documents",
  "upload.subtitle": "Upload documents for automated classification and AI-powered analysis",
  "upload.dragDrop": "Upload Documents",
  "upload.dragDropActive": "Drop Files Here!",
  "upload.dragDropDesc": "Drag and drop your files here, or click the button below to browse",
  "upload.dragDropActiveDesc": "Release to upload your files",
  "upload.chooseFiles": "Choose Files",
  "upload.fileTypes": "PDF, DOCX, Images",
  "upload.maxSize": "Maximum file size: 10MB per file",
  "upload.selectedFiles": "Selected Files",
  "upload.filesReady": "files ready for upload",
  "upload.clearAll": "Clear All",
  "upload.uploadAll": "Upload All Files",
  "upload.totalSize": "Total size:",
  "upload.pdfDocs": "PDF Documents",
  "upload.pdfDesc": "Reports, forms, scanned docs",
  "upload.wordDocs": "Word Documents",
  "upload.wordDesc": "DOC, DOCX files",
  "upload.images": "Images",
  "upload.imagesDesc": "PNG, JPEG with OCR",
  "upload.aiPipeline": "AI Processing Pipeline",
  "upload.processing": "Processing...",
  "upload.step1": "OCR Text Extraction",
  "upload.step2": "Auto Classification",
  "upload.step3": "AI Summarization",
  "upload.step4": "Smart Routing",
  "upload.recentlyUploaded": "Recently Uploaded",
  "upload.audit": "Audit",
  "upload.graph": "Graph",
  "upload.ready": "Ready",
  "upload.uploaded": "Uploaded",
  "upload.error": "Error",
  "upload.uploading": "Uploading...",
  "upload.adding": "Adding...",
  "upload.addAnnotation": "Add Annotation",
  "upload.noAnnotations": "No annotations yet.",
  "upload.summary": "Summary",
  "upload.annotations": "Annotations",
  "upload.translating": "Translating...",
  "upload.suggestCorrection": "Suggest Malayalam correction",
  "upload.submit": "Submit",
  "upload.noTranslation": "No Malayalam translation yet.",
  "upload.noSummary": "No summary.",
  "upload.thanks": "Thanks! We'll learn from this correction.",
  // Navigation
  "nav.back": "Back",
  "nav.home": "Home",
  "nav.dashboard": "Dashboard",
  "nav.upload": "Upload Documents",
  "nav.search": "Search & Filter",
  "nav.compliance": "Compliance",
  "nav.notifications": "Notifications",
  "nav.knowledge": "Knowledge Hub",
  "nav.profile": "Profile",
  "nav.settings": "Settings",
  "nav.logout": "Logout",
  // Quick Stats
  "stats.totalDocs": "Total Documents",
  "stats.pendingReview": "Pending Review",
  "stats.criticalAlerts": "Critical Alerts",
  // Common
  "common.loading": "Loading...",
  "common.error": "Error",
  "common.success": "Success",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.view": "View",
  "common.close": "Close",
  "common.yes": "Yes",
  "common.no": "No",
  "common.ok": "OK"
};

const ml: Dictionary = {
  "gov.title.hi": "भारत सरकार |",
  "gov.title.en": "Government of India",
  "gov.skip": "ഉള്ളടക്കത്തിലേക്ക് പോകുക",
  "gov.english": "English",
  "nav.about": "ഞങ്ങളെ കുറിച്ച്",
  "nav.initiatives": "ഡിജിറ്റൽ ഇന്ത്യ പദ്ധതികൾ",
  "nav.ecosystem": "ഡിജിറ്റൽ ഇന്ത്യ ഇക്കോസിസ്റ്റം",
  "search.placeholder": "ഇവിടെ തിരയുക...",
  "sidebar.navigation": "നാവിഗേഷന്‍",
  "sidebar.dashboard": "ഡാഷ്ബോർഡ്",
  "sidebar.upload": "ഡോക്യുമെന്റുകൾ അപ്ലോഡ് ചെയ്യുക",
  "sidebar.search": "തിരയുക & ഫിൽട്ടർ",
  "sidebar.compliance": "കമ്പ്ലയൻസ്",
  "sidebar.notifications": "അറിയിപ്പുകൾ",
  "sidebar.knowledge": "നോളജ് ഹബ്",
  "dash.greeting": "സുപ്രഭാതം, അഡ്മിൻ",
  "dash.greet.morning": "സുപ്രഭാതം",
  "dash.greet.afternoon": "ശുഭ മധ്യാഹ്നം",
  "dash.greet.evening": "ശുഭ സായാഹ്നം",
  "dash.greet.night": "ശുഭ രാത്രി",
  "dash.subtitle": "അഡ്മിന് വേണ്ടി നിങ്ങളുടെ ഡോക്യുമെന്റ് അവലോകനം",
  "dash.filter.today": "ഇന്ന്",
  "dash.filter.week": "ഈ ആഴ്ച",
  "dash.filter.month": "ഈ മാസം",
  "dash.upload": "ഡോക്യുമെന്റ് അപ്ലോഡ്",
  "dash.docsProcessed": "പ്രോസസ്സുചെയ്ത ഡോക്യുമെന്റുകൾ",
  "dash.aiAccuracy": "AI കൃത്യത",
  "dash.processingTime": "പ്രോസസ്സിംഗ് സമയം",
  "dash.complianceRate": "കമ്പ്ലയൻസ് നിരക്ക്",
  "dash.aiFeed": "AI ഡോക്യുമെന്റ് ഫീഡ്",
  "dash.live": "ലൈവ് പ്രോസസ്സിംഗ്",
  "search.title": "സ്മാർട്ട് തിരച്ചിൽ",
  "search.subtitle": "പ്രാകൃത ഭാഷ പ്രോസസ്സിംഗോടെ EN/ML ബുദ്ധിമുട്ടില്ലാത്ത തിരച്ചിൽ",
  "search.ai": "AI-സഹായിത തിരച്ചിൽ",
  "search.ai.desc": "ഇംഗ്ലീഷ്/മലയാളം ബുദ്ധിപരം തിരച്ചിൽ",
  "search.bar.placeholder": "ഡോക്യുമെന്റുകൾ തിരയുക... ('സേഫ്റ്റി പ്രോട്ടോക്കോൾ', 'ബജറ്റ് റിപ്പോർട്ട്', 'മെട്രോ നിയമങ്ങൾ')",
  "search.filters.language": "ഭാഷ",
  "search.filters.department": "ഡിപ്പാർട്ട്മെന്റ്",
  "search.filters.date": "തീയതി പരിധി",
  "search.lang.all": "എല്ലാ ഭാഷകളും",
  "search.lang.en": "ഇംഗ്ലീഷ്",
  "search.lang.ml": "മലയാളം",
  "search.lang.bi": "രണ്ടുഭാഷ",
  "search.date.all": "എല്ലാ സമയം",
  "search.date.today": "ഇന്ന്",
  "search.date.week": "ഈ ആഴ്ച",
  "search.date.month": "ഈ മാസം",
  "search.date.quarter": "ഈ ക്വാർട്ടർ",
  "search.results": "തിരച്ചിൽ ഫലങ്ങൾ",
  "search.results.time": "0.3 സെക്കൻഡിൽ ഫലങ്ങൾ",
  "search.ai.summary": "AI സംഗ്രഹം",
  "search.view": "ഡോക്യുമെന്റ് കാണുക",
  "search.download": "ഡൗൺലോഡ്",
  "search.share": "പങ്കിടുക",
  "search.processed": "AI പ്രോസസ്സുചെയ്തത്",
  // Upload page
  "upload.title": "ഡോക്യുമെന്റുകൾ അപ്ലോഡ് ചെയ്യുക",
  "upload.subtitle": "ഓട്ടോമേറ്റഡ് വർഗ്ഗീകരണത്തിനും AI-സഹായിത വിശകലനത്തിനും ഡോക്യുമെന്റുകൾ അപ്ലോഡ് ചെയ്യുക",
  "upload.dragDrop": "ഡോക്യുമെന്റുകൾ അപ്ലോഡ് ചെയ്യുക",
  "upload.dragDropActive": "ഫയലുകൾ ഇവിടെ ഡ്രോപ്പ് ചെയ്യുക!",
  "upload.dragDropDesc": "നിങ്ങളുടെ ഫയലുകൾ ഇവിടെ ഡ്രാഗ് ചെയ്ത് ഡ്രോപ്പ് ചെയ്യുക, അല്ലെങ്കിൽ താഴെയുള്ള ബട്ടൺ ക്ലിക്ക് ചെയ്ത് ബ്രൗസ് ചെയ്യുക",
  "upload.dragDropActiveDesc": "നിങ്ങളുടെ ഫയലുകൾ അപ്ലോഡ് ചെയ്യാൻ റിലീസ് ചെയ്യുക",
  "upload.chooseFiles": "ഫയലുകൾ തിരഞ്ഞെടുക്കുക",
  "upload.fileTypes": "PDF, DOCX, ഇമേജുകൾ",
  "upload.maxSize": "പരമാവധി ഫയൽ വലുപ്പം: ഫയലിന് 10MB",
  "upload.selectedFiles": "തിരഞ്ഞെടുത്ത ഫയലുകൾ",
  "upload.filesReady": "അപ്ലോഡിനായി തയ്യാറായ ഫയലുകൾ",
  "upload.clearAll": "എല്ലാം മായ്ക്കുക",
  "upload.uploadAll": "എല്ലാ ഫയലുകളും അപ്ലോഡ് ചെയ്യുക",
  "upload.totalSize": "മൊത്തം വലുപ്പം:",
  "upload.pdfDocs": "PDF ഡോക്യുമെന്റുകൾ",
  "upload.pdfDesc": "റിപ്പോർട്ടുകൾ, ഫോമുകൾ, സ്കാൻ ചെയ്ത ഡോക്യുമെന്റുകൾ",
  "upload.wordDocs": "വേഡ് ഡോക്യുമെന്റുകൾ",
  "upload.wordDesc": "DOC, DOCX ഫയലുകൾ",
  "upload.images": "ഇമേജുകൾ",
  "upload.imagesDesc": "OCR ഉള്ള PNG, JPEG",
  "upload.aiPipeline": "AI പ്രോസസ്സിംഗ് പൈപ്പ്ലൈൻ",
  "upload.processing": "പ്രോസസ്സിംഗ്...",
  "upload.step1": "OCR ടെക്സ്റ്റ് എക്സ്ട്രാക്ഷൻ",
  "upload.step2": "ഓട്ടോ വർഗ്ഗീകരണം",
  "upload.step3": "AI സംഗ്രഹം",
  "upload.step4": "സ്മാർട്ട് റൂട്ടിംഗ്",
  "upload.recentlyUploaded": "അടുത്തിടെ അപ്ലോഡ് ചെയ്തത്",
  "upload.audit": "ഓഡിറ്റ്",
  "upload.graph": "ഗ്രാഫ്",
  "upload.ready": "തയ്യാറാണ്",
  "upload.uploaded": "അപ്ലോഡ് ചെയ്തു",
  "upload.error": "പിശക്",
  "upload.uploading": "അപ്ലോഡ് ചെയ്യുന്നു...",
  "upload.adding": "ചേർക്കുന്നു...",
  "upload.addAnnotation": "അനോട്ടേഷൻ ചേർക്കുക",
  "upload.noAnnotations": "ഇതുവരെ അനോട്ടേഷനുകളില്ല.",
  "upload.summary": "സംഗ്രഹം",
  "upload.annotations": "അനോട്ടേഷനുകൾ",
  "upload.translating": "വിവർത്തനം ചെയ്യുന്നു...",
  "upload.suggestCorrection": "മലയാളം തിരുത്തൽ നിർദ്ദേശിക്കുക",
  "upload.submit": "സമർപ്പിക്കുക",
  "upload.noTranslation": "ഇതുവരെ മലയാളം വിവർത്തനമില്ല.",
  "upload.noSummary": "സംഗ്രഹമില്ല.",
  "upload.thanks": "നന്ദി! ഈ തിരുത്തലിൽ നിന്ന് ഞങ്ങൾ പഠിക്കും.",
  // Navigation
  "nav.back": "തിരികെ",
  "nav.home": "ഹോം",
  "nav.dashboard": "ഡാഷ്ബോർഡ്",
  "nav.upload": "ഡോക്യുമെന്റുകൾ അപ്ലോഡ് ചെയ്യുക",
  "nav.search": "തിരയുക & ഫിൽട്ടർ",
  "nav.compliance": "കമ്പ്ലയൻസ്",
  "nav.notifications": "അറിയിപ്പുകൾ",
  "nav.knowledge": "നോളജ് ഹബ്",
  "nav.profile": "പ്രൊഫൈൽ",
  "nav.settings": "ക്രമീകരണങ്ങൾ",
  "nav.logout": "ലോഗൗട്ട്",
  // Quick Stats
  "stats.totalDocs": "മൊത്തം ഡോക്യുമെന്റുകൾ",
  "stats.pendingReview": "അവലോകനത്തിനായി കാത്തിരിക്കുന്നു",
  "stats.criticalAlerts": "നിർണായക അലേർട്ടുകൾ",
  // Common
  "common.loading": "ലോഡ് ചെയ്യുന്നു...",
  "common.error": "പിശക്",
  "common.success": "വിജയം",
  "common.cancel": "റദ്ദാക്കുക",
  "common.save": "സേവ് ചെയ്യുക",
  "common.delete": "ഇല്ലാതാക്കുക",
  "common.edit": "എഡിറ്റ് ചെയ്യുക",
  "common.view": "കാണുക",
  "common.close": "അടയ്ക്കുക",
  "common.yes": "അതെ",
  "common.no": "ഇല്ല",
  "common.ok": "ശരി"
};

const dictionaries: Record<LanguageCode, Dictionary> = { en, ml };

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "app_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as LanguageCode | null) : null;
    if (stored === "en" || stored === "ml") {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, language);
    }
  }, [language]);

  const t = useMemo(() => {
    const dict = dictionaries[language] || dictionaries.en;
    return (key: string) => dict[key] ?? key;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback to safe defaults if provider is missing
    return {
      language: "en",
      setLanguage: () => {},
      t: (key: string) => (dictionaries.en[key] ?? key),
    };
  }
  return ctx;
}


