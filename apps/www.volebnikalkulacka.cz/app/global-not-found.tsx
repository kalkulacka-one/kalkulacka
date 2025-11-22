import "./globals.css";

import type { Metadata } from "next";

import { NotFoundPage } from "../calculator/components/server";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="cs">
      <body>
        <NotFoundPage />
      </body>
    </html>
  );
}
