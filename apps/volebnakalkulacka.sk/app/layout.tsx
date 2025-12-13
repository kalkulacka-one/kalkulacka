import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volebná kalkulačka",
  description: "Volebná kalkulačka pre Slovensko",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <body>{children}</body>
    </html>
  );
}
