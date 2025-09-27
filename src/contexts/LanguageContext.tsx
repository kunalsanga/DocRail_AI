"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type LanguageCode = "en" | "ml";

type Dictionary = Record<string, string>;

const en: Dictionary = {
  "gov.title.hi": "भारत सरकार |",
  "gov.title.en": "Government of India",
  "gov.skip": "Skip to content",
  "gov.english": "English",
  "nav.home": "Home",
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
  "search.processed": "Processed by AI"
};

const ml: Dictionary = {
  "gov.title.hi": "भारत सरकार |",
  "gov.title.en": "Government of India",
  "gov.skip": "ഉള്ളടക്കത്തിലേക്ക് പോകുക",
  "gov.english": "English",
  "nav.home": "ഹോം",
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
  "search.processed": "AI പ്രോസസ്സുചെയ്തത്"
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


