"use client";

import { ErrorReporter } from "@/components/client";

export default function ErrorBoundary({ error }: { error: Error & { digest?: string } }) {
  return <ErrorReporter error={error} />;
}
