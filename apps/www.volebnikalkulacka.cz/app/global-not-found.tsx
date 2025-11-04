"use client";
import "./globals.css";
import { useRouter } from "next/navigation";

import { NotFoundPage } from "../calculator/components/server";

export default function GlobalNotFound() {
  const router = useRouter();
  return (
    <html lang="cs">
      <head>
        <title>Stránka nenalezena - Volební kalkulačka</title>
        <meta name="description" content="Vámi požadovaná stránka není k dispozici. Vraťte se na domovskou stránku volební kalkulačky." />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Stránka nenalezena - Volební kalkulačka" />
        <meta property="og:description" content="Vámi požadovaná stránka není k dispozici." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.volebnikalkulacka.cz/" />
      </head>
      <body>
        <NotFoundPage onBackClick={() => router.push("/")} />
      </body>
    </html>
  );
}
