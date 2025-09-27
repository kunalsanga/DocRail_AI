"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          language === "en" 
            ? "bg-blue-600 text-white" 
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage("ml")}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          language === "ml" 
            ? "bg-blue-600 text-white" 
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        മലയാളം
      </button>
    </div>
  );
}
