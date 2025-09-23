import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import Header from "@/components/Header";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "DocRail AI - Intelligent Document Management",
  description: "AI-powered document management system for railway operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)] min-h-screen">
        <AuthProvider>
          <NotificationsProvider>
            <LanguageProvider>
              <Header />
              <main id="main-content">{children}</main>
            </LanguageProvider>
          </NotificationsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}