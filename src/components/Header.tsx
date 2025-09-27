"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNotifications } from "@/contexts/NotificationsContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { unreadCount } = useNotifications();

  return (
    <header className="w-full shadow-sm bg-white">
      {/* Skip to content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:left-4 focus:top-4 focus:bg-white focus:text-blue-900 focus:border focus:border-blue-900 focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      {/* Government blue bar */}
      <div className="w-full bg-[#042B6B] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10 text-xs sm:text-sm">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Image
              src="/india%20flag.jpg"
              alt="India flag"
              width={20}
              height={14}
              className="h-3.5 w-auto sm:h-4"
              priority
            />
            <span className="hidden sm:inline">{t("gov.title.hi")}</span>
            <span>{t("gov.title.en")}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#main-content" className="hover:underline">
              {t("gov.skip")}
            </Link>
            <span aria-hidden className="mx-1 h-4 w-px bg-white/50 hidden sm:inline-block" />
            <div className="hidden md:flex items-center gap-3">
              <button aria-label="Increase font size" className="hover:underline">A+</button>
              <button aria-label="Default font size" className="hover:underline">A</button>
              <button aria-label="Decrease font size" className="hover:underline">A-</button>
            </div>
            <span aria-hidden className="mx-1 h-4 w-px bg-white/50 hidden sm:inline-block" />
            <div className="relative">
              <button
                className="inline-flex items-center gap-1 hover:underline"
                aria-haspopup="true"
                aria-expanded={langOpen}
                onClick={() => setLangOpen((v) => !v)}
              >
                <span className="hidden sm:inline">{language === "en" ? "English" : "Malayalam"}</span>
                <span aria-hidden>▾</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-md bg-white text-black shadow-xl ring-1 ring-black/10 py-1 z-50 dark:bg-slate-900/95 dark:text-white dark:ring-white/10 backdrop-blur">
                  <button
                    className="w-full text-left px-3 py-1.5 text-black hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800/70"
                    onClick={() => { setLanguage("en"); setLangOpen(false); }}
                    aria-pressed={language === "en"}
                  >
                    English
                  </button>
                  <button
                    className="w-full text-left px-3 py-1.5 text-black hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800/70"
                    onClick={() => { setLanguage("ml"); setLangOpen(false); }}
                    aria-pressed={language === "ml"}
                  >
                    Malayalam
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* White navigation bar with logos, menu, search */}
      <div className="w-full bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 gap-4">
            {/* Left logos */}
            <div className="flex items-center gap-6">
              <div className="relative h-14 w-44 sm:h-16 sm:w-56">
                <Image
                  src="/MOEIT.jpg"
                  alt="Ministry of Electronics and Information Technology"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 11rem, 14rem"
                />
              </div>
              <span aria-hidden className="h-10 sm:h-12 w-px bg-gray-300 inline-block" />
              <div className="relative h-12 w-40 sm:h-14 sm:w-52">
                <Image
                  src="/DI.jpg"
                  alt="Digital India"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 10rem, 13rem"
                />
              </div>
            </div>

            {/* Center brand */}
            <div className="hidden lg:flex items-center">
              <div className="leading-tight text-slate-800">
                <div className="text-[18px] font-semibold">DocRail AI</div>
                <div className="text-[14px] text-slate-700">
                  {language === "ml" ? "ഇന്ത്യൻ റെയിൽവേ" : "Indian Railways"}
                </div>
                <div className="text-[12px] text-slate-600">
                  {language === "ml" ? "ഡോക്യുമെന്റ് മാനേജ്മെന്റ് സിസ്റ്റം" : "Document Management System"}
                </div>
              </div>
            </div>

            {/* Right search */}
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm"
                aria-label="Open menu"
                onClick={() => setIsMenuOpen((v) => !v)}
              >
                Menu
              </button>
              <form role="search" className="hidden md:flex items-center rounded-full border border-slate-300 px-3 py-1.5 w-64">
                <input
                  type="search"
                  placeholder={t("search.placeholder")}
                  className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400"
                  aria-label="Search"
                />
                <span aria-hidden className="ml-2">🔍</span>
              </form>
            </div>
          </div>
        </div>

      {/* Horizontal primary navigation bar */}
      <nav className="w-full bg-[#042B6B] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 py-2 overflow-x-auto">
            <Link prefetch href="/" className="hover:underline whitespace-nowrap">
              {t("nav.home")}
            </Link>
            <Link prefetch href="/dashboard" className="hover:underline whitespace-nowrap">
              {t("nav.dashboard")}
            </Link>
            <Link prefetch href="/upload" className="hover:underline whitespace-nowrap">
              {t("nav.upload")}
            </Link>
            <Link prefetch href="/search" className="hover:underline whitespace-nowrap">
              {t("nav.search")}
            </Link>
            <Link prefetch href="/compliance" className="hover:underline whitespace-nowrap">
              {t("nav.compliance")}
            </Link>
            <Link prefetch href="/notifications" className="hover:underline whitespace-nowrap relative">
              {t("nav.notifications")}
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center text-[10px] px-1.5 py-0.5 bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link prefetch href="/knowledge-hub" className="hover:underline whitespace-nowrap">
              {t("nav.knowledge")}
            </Link>
          </div>
        </div>
      </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold text-slate-800">DocRail AI</div>
                <form role="search" className="flex items-center rounded-full border border-slate-300 px-3 py-1.5 ml-4 flex-1">
                  <input
                    type="search"
                    placeholder={t("search.placeholder")}
                    className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400"
                    aria-label="Search"
                  />
                  <span aria-hidden className="ml-2">🔍</span>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}


