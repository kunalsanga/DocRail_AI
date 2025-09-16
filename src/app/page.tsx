"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { user, isLoading } = useAuth();

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="bg-[var(--card)] shadow-sm rounded-[var(--radius)] border border-[var(--border)] p-8 sm:p-10">
        <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
          Welcome to DocRail AI
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          A simple place to upload, find, and manage your documents.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link prefetch href="/upload" className="block">
              <Button className="w-full" size="lg">Upload</Button>
            </Link>
            <Link prefetch href="/search" className="block">
              <Button variant="secondary" className="w-full" size="lg">Search</Button>
            </Link>
            {isLoading ? (
              <Button disabled className="w-full" size="lg">Loading…</Button>
            ) : user ? (
              <Link prefetch href="/dashboard" className="block">
                <Button variant="outline" className="w-full" size="lg">Go to Dashboard</Button>
              </Link>
            ) : (
              <Link prefetch href="/login" className="block">
                <Button variant="outline" className="w-full" size="lg">Login</Button>
              </Link>
            )}
          </div>

        <p className="mt-6 text-sm text-[var(--muted)]">
          Tip: Use the buttons above to get started quickly.
        </p>
        </div>
        </div>
      </div>
    </main>
  );
}