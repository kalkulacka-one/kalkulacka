"use client";
import { useRouter } from "next/navigation";

import { NotFoundPage } from "../../../../../calculator/components/server";

export default function NotFound() {
  const router = useRouter();
  return <NotFoundPage onBackClick={() => router.push("/")} />;
}
