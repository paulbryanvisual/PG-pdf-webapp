import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrettyGrandPDF — AI-Powered PDF Accessibility",
  description: "Make your PDFs accessible automatically. AI-powered tagging, alt text generation, and WCAG 2.0 compliance in minutes.",
  keywords: ["PDF accessibility", "WCAG", "PDF/UA", "alt text", "screen reader", "ADA compliance", "Section 508"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
