import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KMRL Document Hub",
  description: "Document management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}