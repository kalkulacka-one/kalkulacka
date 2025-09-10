import type { Metadata, Viewport } from "next";

import "../globals.css";

import { ThemeProvider } from "../../components/client";

export const metadata: Metadata = {
  title: {
    default: "Volební kalkulačka",
    template: "%s — Volební kalkulačka",
  },
  description: "Nejužitečnějších 5 minut před parlamentními volbami 2025",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className="min-h-dvh">
        <ThemeProvider name="default">{children}</ThemeProvider>
      </body>
    </html>
  );
}
